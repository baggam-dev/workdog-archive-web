const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://168.107.14.124:3030'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options)
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  if (!res.ok) throw new Error(data?.error || `요청 실패 (${res.status})`)
  return data
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  folders: () => request('/api/folders'),
  folder: (id) => request(`/api/folders/${id}`),
  createFolder: (payload) =>
    request('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateFolder: (id, payload) =>
    request(`/api/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  deleteFolder: (id) => request(`/api/folders/${id}`, { method: 'DELETE' }),

  folderDocuments: (id) => request(`/api/folders/${id}/documents`),
  document: (docId) => request(`/api/documents/${docId}`),
  patchDocument: (docId, payload) =>
    request(`/api/documents/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  deleteDocument: (folderId, docId) => request(`/api/folders/${folderId}/documents/${docId}`, { method: 'DELETE' }),
  bulkDelete: (folderId, ids) =>
    request(`/api/folders/${folderId}/documents/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    }),
  uploadDocument: async (folderId, title, file) => {
    const form = new FormData()
    if (title) form.append('title', title)
    form.append('file', file)
    return request(`/api/folders/${folderId}/documents`, { method: 'POST', body: form })
  },
}
