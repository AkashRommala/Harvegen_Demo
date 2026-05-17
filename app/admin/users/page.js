'use client'

import { useState } from 'react'
import AdminTable from '@/components/admin/AdminTable'
import { FiSave, FiLoader, FiShield, FiUser } from 'react-icons/fi'

// Custom UserForm component since it only edits roles
function UserRoleForm({ initial, endpoint, headers, onSuccess, onCancel }) {
  const [role, setRole] = useState(initial?.role || 'user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${endpoint}/${initial._id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to update user role')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-1">User:</p>
        <p className="text-white font-semibold">{initial.name} ({initial.email})</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Role</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              role === 'user' ? 'bg-primary-600/20 border-primary-500 text-primary-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <FiUser className="w-6 h-6" />
            <span className="font-semibold text-sm">Standard User</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              role === 'admin' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <FiShield className="w-6 h-6" />
            <span className="font-semibold text-sm">Administrator</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
          {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          Update Role
        </button>
      </div>
    </form>
  )
}

const columns = [
  { key: 'name', label: 'Name', render: (v, row) => <div className="flex flex-col"><span className="font-semibold text-white">{v}</span><span className="text-xs text-gray-500">{row.email}</span></div> },
  { key: 'role', label: 'Role', render: v => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      v === 'admin' ? 'bg-purple-900/50 text-purple-400 border border-purple-500/30' : 'bg-gray-800 text-gray-400'
    }`}>
      {v === 'admin' ? 'Admin' : 'User'}
    </span>
  )},
  { key: 'college', label: 'College', render: v => <span className="text-gray-400 text-sm truncate max-w-[150px]">{v || '—'}</span> },
  { key: 'branch', label: 'Branch', render: v => <span className="text-gray-400 text-sm truncate max-w-[150px]">{v || '—'}</span> },
  { key: 'createdAt', label: 'Registered', render: v => <span className="text-gray-400 text-sm">{new Date(v).toLocaleDateString()}</span> },
]

export default function AdminUsersPage() {
  return (
    <AdminTable
      title="User Management"
      endpoint="/api/users"
      columns={columns}
      idField="_id"
      rowIdentifier={(r) => r.name}
      renderForm={(props) => <UserRoleForm {...props} />}
    />
  )
}
