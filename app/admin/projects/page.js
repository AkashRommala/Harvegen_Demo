'use client'

import AdminTable from '@/components/admin/AdminTable'
import ProjectForm from '@/components/admin/ProjectForm'

const columns = [
  { key: 'imageURL', label: '', render: (v) => v ? <img src={v} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700" /> },
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug', render: v => <span className="font-mono text-xs text-gray-500">{v}</span> },
  { key: 'difficulty', label: 'Difficulty', render: v => {
    const colors = { beginner: 'text-emerald-400 bg-emerald-900/30', intermediate: 'text-amber-400 bg-amber-900/30', advanced: 'text-red-400 bg-red-900/30' }
    return <span className={`px-2 py-1 rounded-lg text-xs font-bold ${colors[v] || 'text-gray-400 bg-gray-800'}`}>{v}</span>
  }},
  { key: 'mcu', label: 'MCU' },
  { key: 'featured', label: 'Featured', render: v => <span className={`text-xs ${v ? 'text-emerald-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
]

export default function AdminProjectsPage() {
  return (
    <AdminTable
      title="Projects"
      endpoint="/api/projects"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      filterOptions={[
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ]}
      queryKey="difficulty"
      renderForm={(props) => <ProjectForm {...props} />}
    />
  )
}
