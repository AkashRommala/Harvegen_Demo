'use client'

import AdminTable from '@/components/admin/AdminTable'
import CategoryForm from '@/components/admin/CategoryForm'

const columns = [
  { key: 'name', label: 'Category Name', render: v => <span className="font-semibold text-white">{v}</span> },
  { key: 'slug', label: 'Slug', render: v => <span className="text-gray-400 font-mono text-xs">{v}</span> },
  { key: 'description', label: 'Description', render: v => <span className="text-gray-400 text-sm truncate max-w-xs">{v || '—'}</span> },
]

export default function AdminCategoriesPage() {
  return (
    <AdminTable
      title="Categories"
      endpoint="/api/categories"
      columns={columns}
      idField="_id"
      rowIdentifier={(r) => r.name}
      renderForm={(props) => <CategoryForm {...props} />}
    />
  )
}
