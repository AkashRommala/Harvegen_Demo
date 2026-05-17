'use client'

import { useState, useEffect } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import TutorialForm from '@/components/admin/TutorialForm'

export default function AdminTutorialsPage() {
  const [categories, setCategories] = useState([])
  const [categoryLabels, setCategoryLabels] = useState({})

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const catList = json.data
          setCategories(catList.map(c => ({ value: c.slug, label: c.name })))
          const labels = {}
          catList.forEach(c => { labels[c.slug] = c.name })
          setCategoryLabels(labels)
        }
      })
  }, [])

  const columns = [
    { key: 'imageURL', label: '', render: (v) => v ? <img src={v} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700" /> },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: v => <span className="text-xs text-primary-400 font-medium">{categoryLabels[v] || v}</span> },
    { key: 'difficulty', label: 'Level', render: v => {
      const colors = { Beginner: 'text-emerald-400', Intermediate: 'text-amber-400', Advanced: 'text-red-400' }
      return <span className={`text-xs font-bold ${colors[v] || 'text-gray-400'}`}>{v}</span>
    }},
    { key: 'time', label: 'Duration' },
    { key: 'featured', label: 'Featured', render: v => <span className={`text-xs ${v ? 'text-emerald-400' : 'text-gray-600'}`}>{v ? '★ Yes' : 'No'}</span> },
  ]

  return (
    <AdminTable
      title="Tutorials"
      endpoint="/api/tutorials"
      columns={columns}
      idField="slug"
      rowIdentifier={(r) => r.title}
      filterOptions={categories}
      queryKey="category"
      renderForm={(props) => <TutorialForm {...props} />}
    />
  )
}

