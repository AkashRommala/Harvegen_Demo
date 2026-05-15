import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiGithub, FiArrowLeft } from 'react-icons/fi'

export async function generateMetadata(props) {
  const params = await props.params;
  await connectDB()
  const project = await Project.findOne({ slug: params.slug }).lean()
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} | Harvegen Projects`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageURL ? [project.imageURL] : [],
    },
  }
}

const DIFFICULTY_COLORS = {
  beginner: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  intermediate: 'text-amber-700 border-amber-200 bg-amber-50',
  advanced: 'text-red-700 border-red-200 bg-red-50',
}

export default async function ProjectDetailPage(props) {
  const params = await props.params;
  await connectDB()
  const project = await Project.findOne({ slug: params.slug }).lean()
  if (!project) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero */}
      <header className="pt-[100px] pb-16 bg-gradient-to-br from-slate-900 via-gray-900 to-primary-950 text-white relative overflow-hidden">
        {project.imageURL && (
          <div className="absolute inset-0">
            <img src={project.imageURL} alt={project.title} className="w-full h-full object-cover opacity-10" />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-sm text-gray-400 mb-6 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600"> / </span>
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-gray-600"> / </span>
            <span className="text-primary-400">{project.title}</span>
          </div>

          <div className="flex gap-3 flex-wrap mb-4">
            {project.tags.map((tag, i) => (
              <span key={i} className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${DIFFICULTY_COLORS[tag] || 'text-blue-400 border-blue-700/30 bg-blue-900/20'}`}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{project.title}</h1>
          <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mb-6">{project.description}</p>

          <div className="flex gap-4 flex-wrap">
            {project.gitHubLink && (
              <a href={project.gitHubLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-semibold transition-all">
                <FiGithub className="w-4 h-4" />
                View on GitHub
              </a>
            )}
            {project.mcu && (
              <span className="flex items-center gap-2 px-4 py-3 bg-primary-600/20 border border-primary-600/30 text-primary-300 rounded-xl text-sm">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                {project.mcu}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-8 py-16">
        {project.imageURL && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img src={project.imageURL} alt={project.title} className="w-full h-80 object-cover" />
          </div>
        )}

        {project.fullContent ? (
          <div className="prose prose-lg prose-gray max-w-none">
            {project.fullContent.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>
              if (line.startsWith('- ')) return <li key={i} className="text-gray-700 leading-relaxed ml-4">{line.slice(2)}</li>
              if (line === '') return <div key={i} className="h-4" />
              return <p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Full Article Coming Soon</h2>
            <p className="text-gray-500">Detailed documentation is being prepared for this project.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
          <Link href="/projects" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <Link href="/tutorials" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            View Tutorials →
          </Link>
        </div>
      </article>
    </main>
  )
}
