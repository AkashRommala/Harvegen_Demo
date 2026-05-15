'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { FiPlay, FiRefreshCw, FiTerminal, FiCode } from 'react-icons/fi'

export default function CodePlayground({ title, language = 'c', initialCode }) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [statusText, setStatusText] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')
    setError('')
    setStatusText('Sending to compiler...')

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Execution failed')
      }

      setOutput(data.stdout || '')
      setError(data.stderr || '')
      setStatusText(data.status || 'Finished')
    } catch (err) {
      setError(err.message)
      setStatusText('Error')
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput('')
    setError('')
    setStatusText('')
  }

  return (
    <div className="my-8 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FiCode className="w-4 h-4 text-primary-500" />
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</h4>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            disabled={isRunning || code === initialCode}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-colors"
            title="Reset to default code"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isRunning ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
            {isRunning ? 'Compiling...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[300px] w-full border-b border-slate-200 dark:border-slate-800">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />
      </div>

      {/* Terminal Output */}
      <div className="bg-[#0d1117] min-h-[150px] max-h-[300px] overflow-y-auto p-4 font-mono text-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2 select-none uppercase tracking-wider text-[11px] font-bold border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <FiTerminal className="w-3.5 h-3.5" /> Output
          </div>
          {statusText && !isRunning && (
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              statusText === 'Accepted' ? 'bg-green-500/10 text-green-400' :
              statusText === 'Error' ? 'bg-red-500/10 text-red-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>
              {statusText}
            </span>
          )}
        </div>
        
        {!output && !error && !isRunning && (
          <div className="text-slate-500 italic mt-4">Click "Run Code" to compile and see the output here...</div>
        )}
        
        {isRunning && (
          <div className="text-primary-400 flex items-center gap-2 mt-4">
            <FiRefreshCw className="w-4 h-4 animate-spin" /> Compiling code on Judge0...
          </div>
        )}

        {!isRunning && output && (
          <pre className="text-green-400 whitespace-pre-wrap font-mono mt-2">{output}</pre>
        )}
        
        {!isRunning && error && (
          <pre className="text-red-400 whitespace-pre-wrap mt-2 font-mono">{error}</pre>
        )}
      </div>
    </div>
  )
}
