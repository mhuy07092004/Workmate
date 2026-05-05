import { useRef, useEffect } from 'react'

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function ProfilePictureCard({ fullName, file, previewUrl, onFileChange, onRemove, error }) {
  const inputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onFileChange(null, 'Please upload a JPEG, PNG, WebP, or GIF image.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (selected.size > MAX_SIZE_BYTES) {
      onFileChange(null, 'Image must be under 5 MB.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    onFileChange(selected, null)
  }

  const handleRemove = () => {
    onRemove()
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zM12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        Profile Picture
      </h2>

      <div className="flex items-center gap-6">
        {/* Avatar preview */}
        <div className="relative shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center select-none border-2 border-slate-200">
              {getInitials(fullName)}
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            {file ? file.name : 'Upload a profile photo. JPEG, PNG, WebP, or GIF — max 5 MB.'}
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              {file ? 'Change photo' : 'Choose photo'}
            </button>
            {file && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 text-sm font-medium bg-red-50 text-red-500 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default ProfilePictureCard
