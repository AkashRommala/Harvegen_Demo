'use client'

import { useState, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import { FiUploadCloud, FiX, FiCheck, FiLoader } from 'react-icons/fi'

/**
 * CloudinaryUploader
 * Renders a drag-and-drop upload zone. On file selection, uploads to /api/upload
 * and calls onUpload(url) with the resulting Cloudinary URL.
 */
export default function CloudinaryUploader({ onUpload, folder = 'harvegen', current = '', label = 'Upload Image' }) {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(current)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP, etc.)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB')
      return
    }

    setError(null)
    setLoading(true)
    setSuccess(false)
    setPreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-user-role': user?.role || '',
          'x-user-email': user?.email || '',
        },
        body: formData,
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Upload failed')

      onUpload(json.data.url)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-primary-500 transition-colors group"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(''); onUpload('') }}
              className="absolute top-2 right-2 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <FiUploadCloud className="w-10 h-10 text-gray-600 mx-auto mb-3 group-hover:text-primary-500 transition-colors" />
            <p className="text-gray-400 text-sm">
              Drag & drop an image here, or <span className="text-primary-400 font-medium">click to browse</span>
            </p>
            <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP · Max 5 MB</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center rounded-xl">
            <FiLoader className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <FiCheck className="w-4 h-4" /> Uploaded to Cloudinary successfully
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
