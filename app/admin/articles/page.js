'use client'

import AdminTable from '@/components/admin/AdminTable'
import ArticleForm from '@/components/admin/ArticleForm'

const columns = [
  { key: 'title', label: 'Article Title', render: v => <span className="font-semibold text-white">{v}</span> },
  { key: 'difficulty', label: 'Level', render: v => {
    const colors = { Beginner: 'text-emerald-400', Intermediate: 'text-amber-400', Advanced: 'text-red-400' }
    return <span className={`text-xs font-bold ${colors[v] || 'text-gray-400'}`}>{v}</span>
  }},
  { key: 'time', label: 'Duration' },
  { key: 'featured', label: 'Featured', render: v => <span className={`text-xs ${v ? 'text-emerald-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
]

export default function AdminArticlesPage() {
  return (
    <AdminTable
      title="Articles"
      endpoint="/api/articles"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      renderForm={(props) => <ArticleForm {...props} />}
    />
  )
}
