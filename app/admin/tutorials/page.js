'use client'

import AdminTable from '@/components/admin/AdminTable'
import TutorialForm from '@/components/admin/TutorialForm'

const CATEGORY_LABELS = { c: 'Embedded C', basics: 'MCU Basics', proto: 'Protocols', rtos: 'RTOS' }

const columns = [
  { key: 'imageURL', label: '', render: (v) => v ? <img src={v} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700" /> },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category', render: v => <span className="text-xs text-primary-400 font-medium">{CATEGORY_LABELS[v] || v}</span> },
  { key: 'difficulty', label: 'Level', render: v => {
    const colors = { Beginner: 'text-emerald-400', Intermediate: 'text-amber-400', Advanced: 'text-red-400' }
    return <span className={`text-xs font-bold ${colors[v] || 'text-gray-400'}`}>{v}</span>
  }},
  { key: 'time', label: 'Duration' },
  { key: 'featured', label: 'Featured', render: v => <span className={`text-xs ${v ? 'text-emerald-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
]

export default function AdminTutorialsPage() {
  return (
    <AdminTable
      title="Tutorials"
      endpoint="/api/tutorials"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      filterOptions={[
        { value: 'c', label: 'Embedded C' },
        { value: 'basics', label: 'MCU Basics' },
        { value: 'proto', label: 'Protocols' },
        { value: 'rtos', label: 'RTOS' },
      ]}
      queryKey="category"
      renderForm={(props) => <TutorialForm {...props} />}
    />
  )
}
