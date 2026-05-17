'use client'

import { useState, useEffect } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import TutorialForm from '@/components/admin/TutorialForm'

export default function AdminTutorialsPage() {
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
    { key: 'title', label: 'Title', render: v => <span className="font-semibold text-white">{v}</span> },
    { key: 'course', label: 'Course', render: v => <span className="text-xs text-primary-400 font-medium">{courseLabels[v] || v}</span> },
    { key: 'articles', label: 'Articles Mapped', render: v => <span className="text-gray-400 text-sm">{v?.length || 0} articles</span> },
  ]

  return (
    <AdminTable
      title="Tutorial Modules"
      endpoint="/api/tutorials"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      filterOptions={courses}
      queryKey="course"
      renderForm={(props) => <TutorialForm {...props} />}
    />
  )
}
