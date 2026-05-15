import connectDB from '@/lib/mongodb'
import Tutorial from '@/models/Tutorial'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkCallout from '@/lib/remark-callout'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import 'highlight.js/styles/github-dark.css'
import { Clock, BarChart, Tag, CheckCircle2, ChevronRight, BookOpen, Layers, Code } from 'lucide-react'
import CalloutCard from '@/components/ui/CalloutCard'
import CodePlayground from '@/components/ui/CodePlayground'

export async function generateMetadata(props) {
  const params = await props.params;
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug }).lean()
  if (!tutorial) return { title: 'Tutorial Not Found' }
  return {
    title: `${tutorial.title} | Harvegen Tutorials`,
    description: tutorial.description,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      images: tutorial.imageURL ? [tutorial.imageURL] : [],
    },
  }
}

// Utility to create URL-friendly anchors from headings
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const CATEGORY_NAMES = {
  'c': 'Embedded C',
  'basics': 'MCU Basics',
  'proto': 'Protocols',
  'rtos': 'RTOS'
}

const DIFFICULTY_COLORS = {
  Beginner: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20',
  Intermediate: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20',
  Advanced: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border-red-200 dark:border-red-400/20',
}

export default async function TutorialDetailPage(props) {
  const params = await props.params;
  await connectDB()
  const tutorial = await Tutorial.findOne({ slug: params.slug }).lean()
  if (!tutorial) notFound()

  // Debug codeSections
  console.log('[DEBUG] Tutorial fetched:', tutorial.title)
  console.log('[DEBUG] codeSections:', tutorial.codeSections)

  // Fetch related tutorials in the same category for the sidebar
  const relatedTutorials = await Tutorial.find({ category: tutorial.category })
    .select('title slug')
    .sort({ createdAt: 1 })
    .lean()

  const rawLearningPoints = tutorial.learningPoints || []
  const learningPoints = rawLearningPoints.filter(p => p && p.trim() !== '')

  // Extract headings from Markdown for the Table of Contents
  const headingsMatches = Array.from((tutorial.markdownContent || '').matchAll(/^(#{2,3})\s+(.+)$/gm))
  const tocHeaders = headingsMatches.map(match => {
    const text = match[2].replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // remove simple markdown links
    return {
      level: match[1].length,
      text: text,
      id: slugify(text)
    }
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans flex flex-col pt-[72px] transition-colors">
      
      {/* 3-Column Container */}
      <div className="flex-1 w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row relative">
        
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: Category Navigation (Desktop)               */}
        {/* ========================================================= */}
        <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
          <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <Link href="/tutorials" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors group">
              <ChevronRight className="w-4 h-4 rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" />
              All Tutorials
            </Link>
            
            <div className="mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-200">
                {CATEGORY_NAMES[tutorial.category]}
              </h3>
            </div>

            <nav className="flex flex-col gap-1.5 border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-4">
              {relatedTutorials.map((rt) => {
                const isActive = rt.slug === tutorial.slug
                return (
                  <Link 
                    key={rt._id} 
                    href={`/tutorials/${rt.slug}`}
                    className={`text-base py-2 transition-colors relative ${isActive ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-500/10 -ml-4 pl-4 rounded-r-lg' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    {isActive && (
                      <span className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-primary-600 dark:bg-primary-500" />
                    )}
                    {rt.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN CONTENT (Center)                                     */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 px-6 md:px-12 py-10 lg:py-16">
          
          {/* Breadcrumbs for Mobile */}
          <div className="lg:hidden text-sm text-slate-500 mb-6 font-mono flex items-center gap-2">
            <Link href="/tutorials" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Tutorials</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 dark:text-slate-300 truncate">{CATEGORY_NAMES[tutorial.category]}</span>
          </div>

          {/* Hero Section */}
          <header className="mb-12">
            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${DIFFICULTY_COLORS[tutorial.difficulty]}`}>
                <BarChart className="w-3 h-3" /> {tutorial.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="w-3 h-3" /> {tutorial.time}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Tag className="w-3 h-3" /> {CATEGORY_NAMES[tutorial.category]}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.15] tracking-tight">
              {tutorial.title}
            </h1>
            
            {tutorial.summary && (
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {tutorial.summary}
              </p>
            )}
          </header>

          {/* Mobile TOC / Learning Points wrapper */}
          <div className="xl:hidden flex flex-col gap-6 mb-12">
            {/* Mobile TOC */}
            {tocHeaders.length > 0 && (
              <details className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group overflow-hidden">
                <summary className="p-4 font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer list-none">
                  <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary-500 dark:text-primary-400"/> On this page</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-open:rotate-90 transition-transform" />
                </summary>
                <nav className="p-4 pt-0 flex flex-col gap-2.5 border-t border-slate-200 dark:border-slate-800/50 mt-2">
                  {tocHeaders.map((header, idx) => (
                    <a key={idx} href={`#${header.id}`} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                      {header.text}
                    </a>
                  ))}
                </nav>
              </details>
            )}

            {/* Mobile Other Tutorials */}
            <details className="lg:hidden w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group overflow-hidden">
              <summary className="p-4 font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer list-none">
                <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary-500 dark:text-primary-400"/> In this category</span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-open:rotate-90 transition-transform" />
              </summary>
              <nav className="p-4 pt-0 flex flex-col gap-2.5 border-t border-slate-200 dark:border-slate-800/50 mt-2">
                {relatedTutorials.map((rt) => (
                  <Link key={rt._id} href={`/tutorials/${rt.slug}`} className={`text-sm transition-colors ${rt.slug === tutorial.slug ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    {rt.title}
                  </Link>
                ))}
              </nav>
            </details>
          </div>

          {/* What You'll Learn Box */}
          {learningPoints.length > 0 && (
            <div className="mb-16 bg-primary-50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/20 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                What you'll learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tutorial Markdown Content */}
          <article className="mb-16">
            <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none 
              prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-semibold
              prose-h2:scroll-mt-28 prose-h3:scroll-mt-28
              prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
              prose-pre:bg-slate-50 dark:prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-800 prose-pre:rounded-xl
              prose-code:text-primary-600 dark:prose-code:text-primary-300 prose-code:bg-primary-50 dark:prose-code:bg-primary-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
              prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-500/5 prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-li:marker:text-slate-400 dark:prose-li:marker:text-slate-500
              prose-img:rounded-xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkDirective, remarkCallout]} 
                rehypePlugins={[rehypeSlug, rehypeHighlight]}
                components={{
                  callout: (props) => <CalloutCard {...props} />
                }}
              >
                {tutorial.markdownContent || ''}
              </ReactMarkdown>
            </div>
          </article>

          {/* Interactive Code Lab */}
          {tutorial.codeSections && tutorial.codeSections.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Code className="w-8 h-8 text-primary-500" />
                Interactive Code Lab
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
                Test your knowledge by running and modifying the code examples below. The editor provides a full C compiler environment directly in your browser.
              </p>
              
              <div className="flex flex-col gap-10">
                {tutorial.codeSections.map((section, idx) => (
                  <CodePlayground 
                    key={idx}
                    title={section.title} 
                    language={section.language} 
                    initialCode={section.initialCode} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
            <Link href="/tutorials" className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-center font-medium shadow-sm">
              ← Back to Overview
            </Link>
          </div>

        </main>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: Table of Contents (Desktop)                */}
        {/* ========================================================= */}
        {tocHeaders.length > 0 && (
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-500" />
                On this page
              </h3>
              <nav className="flex flex-col gap-3 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800">
                {tocHeaders.map((header, idx) => (
                  <a key={idx} href={`#${header.id}`} 
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm transition-colors pl-5 relative before:absolute before:left-0 before:top-[6px] before:w-[7px] before:h-[7px] before:rounded-full before:bg-slate-200 dark:before:bg-slate-800 hover:before:bg-primary-500 dark:hover:before:bg-primary-500 before:transition-colors before:border-2 before:border-white dark:before:border-slate-950"
                    style={{ marginLeft: header.level > 2 ? '1rem' : '0' }}>
                    {header.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

      </div>
    </div>
  )
}
