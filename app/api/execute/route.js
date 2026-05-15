import { NextResponse } from 'next/server'

// Simple in-memory rate limiter (For production, use Redis)
const rateLimitMap = new Map()

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    // Rate limit: 5 requests per 10 seconds per IP
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now }
    if (now - userLimit.lastReset > 10000) {
      userLimit.count = 1
      userLimit.lastReset = now
    } else {
      userLimit.count++
      if (userLimit.count > 5) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again in a few seconds.' }, { status: 429 })
      }
    }
    rateLimitMap.set(ip, userLimit)

    const { source_code, language } = await request.json()

    if (!source_code) {
      return NextResponse.json({ error: 'Source code is required' }, { status: 400 })
    }

    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: RAPIDAPI_KEY is missing.' },
        { status: 500 }
      )
    }

    // Map language to Judge0 Language ID
    // 50 = C (GCC 9.2.0), 54 = C++ (GCC 9.2.0), 71 = Python (3.8.1)
    let language_id = 50 
    if (language === 'cpp') language_id = 54
    else if (language === 'python') language_id = 71

    const HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com'

    // STEP 1: Submit code to Judge0
    const submitRes = await fetch(`https://${HOST}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': HOST
      },
      body: JSON.stringify({
        language_id,
        source_code: Buffer.from(source_code).toString('base64'),
      }),
    })

    const submitData = await submitRes.json()

    if (!submitRes.ok) {
      throw new Error(submitData.message || 'Failed to submit code to Judge0')
    }

    const { token } = submitData

    // STEP 2: Poll for results (max 10 seconds)
    let attempts = 0
    let resultData = null

    while (attempts < 10) {
      await sleep(1000) // Wait 1 second
      
      const pollRes = await fetch(`https://${HOST}/submissions/${token}?base64_encoded=true`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': HOST
        }
      })
      
      const pollData = await pollRes.json()
      
      // status.id <= 2 means In Queue or Processing
      if (pollData.status?.id > 2) {
        resultData = pollData
        break
      }
      
      attempts++
    }

    if (!resultData) {
      return NextResponse.json({
        stdout: '',
        stderr: 'Time Limit Exceeded: Code took too long to execute (over 10 seconds).',
        status: 'Time Limit Exceeded'
      })
    }

    // STEP 3: Return results
    // Decode base64 outputs
    const decodeBase64 = (str) => str ? Buffer.from(str, 'base64').toString('utf-8') : ''

    const stdout = decodeBase64(resultData.stdout)
    const stderr = decodeBase64(resultData.stderr)
    const compile_output = decodeBase64(resultData.compile_output)

    // If there is compilation output and it failed, combine it into stderr
    let finalError = stderr
    if (resultData.status?.id === 6) { // 6 = Compilation Error
      finalError = compile_output || stderr
    }

    return NextResponse.json({
      stdout: stdout,
      stderr: finalError,
      status: resultData.status?.description || 'Finished'
    })

  } catch (error) {
    console.error('Execution API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to execute code. Please try again.' },
      { status: 500 }
    )
  }
}
