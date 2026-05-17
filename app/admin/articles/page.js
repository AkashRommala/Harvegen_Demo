'use client'

import { useState, useEffect } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import ArticleForm from '@/components/admin/ArticleForm'

export default function AdminArticlesPage() {
  const [courses, setCourses] = useState([])
  const [courseLabels, setCourseLabels] = useState({})

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const courseList = json.data
          setCourses(courseList.map(c => ({ value: c.slug, label: c.name })))
          const labels = {}
          courseList.forEach(c => { labels[c.slug] = c.name })
          setCourseLabels(labels)
        }
      })
  }, [])

  const columns = [
    { key: 'imageURL', label: '', render: (v) => v ? <img src={v} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700" /> },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Course', render: v => <span className="text-xs text-primary-400 font-medium">{courseLabels[v] || v}</span> },
    { key: 'difficulty', label: 'Level', render: v => {
      const colors = { Beginner: 'text-emerald-400', Intermediate: 'text-amber-400', Advanced: 'text-red-400' }
      return <span className={`text-xs font-bold ${colors[v] || 'text-gray-400'}`}>{v}</span>
    }},
    { key: 'time', label: 'Duration' },
    { key: 'featured', label: 'Featured', render: v => <span className={`text-xs ${v ? 'text-emerald-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
  ]

  return (
    <AdminTable
      title="Articles"
      endpoint="/api/articles"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      filterOptions={courses}
      queryKey="category" // Keeping "category" as query key since the schema field is currently kept as category for backward-compat
      renderForm={(props) => <ArticleForm {...props} />}
    />
  )
}

