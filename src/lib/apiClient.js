const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://168.107.14.124:3030'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(path, options = {}, retryCount = 1) {
  const url = `${API_BASE_URL}${path}`

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    try {
      const res = await fetch(url, options)
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      if (!res.ok) {
        const serverError = new Error(data?.error || `요청 실패 (${res.status})`)
        serverError.status = res.status

        // 5xx 는 1회 재시도
        if (res.status >= 500 && attempt < retryCount) {
          await sleep(250)
          continue
        }
        throw serverError
      }

      return data
    } catch (error) {
      // 네트워크 오류(예: Failed to fetch) 1회 재시도
      if (attempt < retryCount) {
        await sleep(250)
        continue
      }
      throw error
    }
  }

  throw new Error('요청 실패')
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
  generateDocument: (payload) =>
    request('/api/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  generatedDocuments: () => request('/api/generated-documents'),
  generatedDocument: (id) => request(`/api/generated-documents/${id}`),
  patchGeneratedDocument: (id, payload) =>
    request(`/api/generated-documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  regenerateGeneratedDocument: (id, payload) =>
    request(`/api/generated-documents/${id}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    }),
}
