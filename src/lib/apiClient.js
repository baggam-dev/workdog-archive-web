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
  if (!res.ok) {
    throw new Error(data?.error || `요청 실패 (${res.status})`)
  }
  return data
}

export const apiClient = {
  baseUrl: API_BASE_URL,
  health: () => request('/api/folders'),
  folders: () => request('/api/folders'),
}
