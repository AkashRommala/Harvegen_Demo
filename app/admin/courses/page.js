'use client'

import AdminTable from '@/components/admin/AdminTable'
import CourseForm from '@/components/admin/CourseForm'

const columns = [
  { key: 'name', label: 'Course Name', render: v => <span className="font-semibold text-white">{v}</span> },
  { key: 'slug', label: 'Slug', render: v => <span className="text-gray-400 font-mono text-xs">{v}</span> },
  { key: 'description', label: 'Description', render: v => <span className="text-gray-400 text-sm truncate max-w-xs">{v || '—'}</span> },
]

export default function AdminCoursesPage() {
  return (
    <AdminTable
      title="Courses"
      endpoint="/api/courses"
      columns={columns}
      idField="_id"
      rowIdentifier={(r) => r.name}
      renderForm={(props) => <CourseForm {...props} />}
    />
  )
}
