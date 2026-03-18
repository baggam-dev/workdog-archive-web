import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { apiClient } from './lib/apiClient'
import './App.css'

const defaultFilter = {
  title: '',
  category: '',
  fileType: '',
  tag: '',
  onlyImportant: false,
}

const categories = ['계획서', '결과보고', '안내문', '공문', '일정표', '회의자료', '참고자료', '기타']
const fileTypes = ['hwp', 'pdf', 'xlsx', 'xls', 'txt']

function Layout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">WORKDOG ARCHIVE WEB</div>
        <nav className="nav">
          <Link to="/">홈</Link>
          <Link to="/folders">폴더/문서</Link>
          <Link to="/docs">상태</Link>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}

function HomePage() {
  return (
    <section>
      <h1>Workdog React 전환 R3</h1>
      <p className="muted">쓰기 기능(폴더/업로드/중요/메모/삭제) 이관 단계입니다.</p>
      <div className="actions">
        <Link className="btn primary" to="/folders">폴더/문서 관리</Link>
      </div>
    </section>
  )
}

function formatKST(iso) {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

function statusState(loading, error, length) {
  if (loading) return { cls: 'loading', msg: '데이터를 불러오는 중...' }
  if (error) return { cls: 'error', msg: `로드 실패: ${error}` }
  if (length === 0) return { cls: '', msg: '데이터가 없습니다.' }
  return { cls: '', msg: `총 ${length}건 표시 중` }
}

function FoldersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [folderInfo, setFolderInfo] = useState(null)
  const [docs, setDocs] = useState([])
  const [filter, setFilter] = useState(defaultFilter)
  const [sort, setSort] = useState({ key: 'uploadedAt', dir: 'desc' })
  const [checkedDocIds, setCheckedDocIds] = useState([])

  const [createForm, setCreateForm] = useState({ name: '', description: '', color: '#f59e0b' })
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', color: '#f59e0b' })
  const [uploadForm, setUploadForm] = useState({ title: '', file: null })

  const [activeDoc, setActiveDoc] = useState(null)
  const [memoText, setMemoText] = useState('')

  const refreshFolders = async () => {
    const fs = await apiClient.folders()
    setFolders(Array.isArray(fs) ? fs : [])
    if (!selectedFolderId && fs?.length) setSelectedFolderId(fs[0].id)
    if (selectedFolderId && !fs.some((f) => f.id === selectedFolderId)) {
      setSelectedFolderId(fs[0]?.id || '')
    }
  }

  const refreshDocs = async (folderId) => {
    if (!folderId) {
      setFolderInfo(null)
      setDocs([])
      return
    }
    const [folder, documents] = await Promise.all([
      apiClient.folder(folderId),
      apiClient.folderDocuments(folderId),
    ])
    setFolderInfo(folder)
    setDocs(Array.isArray(documents) ? documents : [])
    setCheckedDocIds([])
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        await refreshFolders()
      } catch (e) {
        if (!mounted) return
        setError(e.message || '폴더 로드 실패')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!selectedFolderId) {
        setFolderInfo(null)
        setDocs([])
        return
      }
      try {
        setLoading(true)
        setError('')
        await refreshDocs(selectedFolderId)
      } catch (e) {
        if (!mounted) return
        setError(e.message || '문서 로드 실패')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [selectedFolderId])

  const filteredDocs = useMemo(() => {
    const qTitle = filter.title.trim().toLowerCase()
    const qCategory = filter.category.trim().toLowerCase()
    const qType = filter.fileType.trim().toLowerCase()
    const qTag = filter.tag.trim().toLowerCase()

    const list = docs.filter((d) => {
      const okTitle = !qTitle || String(d.title || '').toLowerCase().includes(qTitle)
      const okCategory = !qCategory || String(d.category || '').toLowerCase() === qCategory
      const okType = !qType || String(d.fileType || '').toLowerCase() === qType
      const okTag = !qTag || (d.tags || []).some((t) => String(t).toLowerCase().includes(qTag))
      const okImportant = !filter.onlyImportant || !!d.isImportant
      return okTitle && okCategory && okType && okTag && okImportant
    })

    const dir = sort.dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      if (sort.key === 'important') return ((a.isImportant ? 1 : 0) - (b.isImportant ? 1 : 0)) * dir
      if (sort.key === 'title') return String(a.title || '').localeCompare(String(b.title || ''), 'ko') * dir
      if (sort.key === 'fileType') return String(a.fileType || '').localeCompare(String(b.fileType || ''), 'ko') * dir
      if (sort.key === 'category') return String(a.category || '').localeCompare(String(b.category || ''), 'ko') * dir
      return (new Date(a.uploadedAt) - new Date(b.uploadedAt)) * dir
    })

    return list
  }, [docs, filter, sort])

  const state = statusState(loading, error, filteredDocs.length)

  const setSortKey = (key) => {
    const defaultDir = key === 'uploadedAt' ? 'desc' : 'asc'
    const opposite = defaultDir === 'asc' ? 'desc' : 'asc'

    if (sort.key !== key) return setSort({ key, dir: defaultDir })
    if (sort.dir === defaultDir) return setSort({ key, dir: opposite })
    return setSort({ key: 'uploadedAt', dir: 'desc' })
  }

  const sortMark = (key) => {
    if (sort.key !== key) return '↕'
    return sort.dir === 'asc' ? '▲' : '▼'
  }

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 2200)
  }

  const onCreateFolder = async () => {
    if (!createForm.name.trim()) return showNotice('폴더명은 필수입니다.')
    try {
      await apiClient.createFolder(createForm)
      await refreshFolders()
      setCreateForm({ name: '', description: '', color: '#f59e0b' })
      showNotice('폴더가 생성되었습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onStartEditFolder = () => {
    if (!folderInfo) return
    setEditForm({
      id: folderInfo.id,
      name: folderInfo.name || '',
      description: folderInfo.description || '',
      color: folderInfo.color || '#f59e0b',
    })
  }

  const onSaveEditFolder = async () => {
    if (!editForm.id) return
    try {
      await apiClient.updateFolder(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        color: editForm.color,
      })
      await refreshFolders()
      await refreshDocs(editForm.id)
      showNotice('폴더가 수정되었습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onDeleteFolder = async () => {
    if (!folderInfo) return
    if (!window.confirm('선택 폴더를 삭제하시겠습니까?')) return
    try {
      await apiClient.deleteFolder(folderInfo.id)
      setActiveDoc(null)
      setMemoText('')
      await refreshFolders()
      showNotice('폴더가 삭제되었습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onUpload = async () => {
    if (!selectedFolderId) return
    if (!uploadForm.file) return showNotice('업로드 파일을 선택해 주세요.')
    try {
      await apiClient.uploadDocument(selectedFolderId, uploadForm.title, uploadForm.file)
      setUploadForm({ title: '', file: null })
      await refreshDocs(selectedFolderId)
      showNotice('문서가 업로드되었습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onToggleImportant = async (doc) => {
    try {
      await apiClient.patchDocument(doc.id, { isImportant: !doc.isImportant })
      await refreshDocs(selectedFolderId)
      if (activeDoc?.id === doc.id) {
        const latest = (await apiClient.folderDocuments(selectedFolderId)).find((d) => d.id === doc.id)
        setActiveDoc(latest || null)
      }
      showNotice('중요 표시를 변경했습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onDeleteOne = async (docId) => {
    if (!selectedFolderId) return
    if (!window.confirm('문서를 삭제하시겠습니까?')) return
    try {
      await apiClient.deleteDocument(selectedFolderId, docId)
      if (activeDoc?.id === docId) {
        setActiveDoc(null)
        setMemoText('')
      }
      await refreshDocs(selectedFolderId)
      showNotice('문서를 삭제했습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onBulkDelete = async () => {
    if (!selectedFolderId || checkedDocIds.length === 0) return
    if (!window.confirm(`선택한 ${checkedDocIds.length}건을 삭제하시겠습니까?`)) return
    try {
      await apiClient.bulkDelete(selectedFolderId, checkedDocIds)
      await refreshDocs(selectedFolderId)
      setCheckedDocIds([])
      showNotice('선택 문서를 삭제했습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  const onOpenDetail = (doc) => {
    setActiveDoc(doc)
    setMemoText(doc.memo || '')
  }

  const onSaveMemo = async () => {
    if (!activeDoc) return
    try {
      await apiClient.patchDocument(activeDoc.id, { memo: memoText })
      const updated = await apiClient.document(activeDoc.id)
      setActiveDoc(updated)
      await refreshDocs(selectedFolderId)
      showNotice('메모를 저장했습니다.')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section>
      <h1>폴더/문서 관리</h1>
      <p className="muted">API Base: {apiClient.baseUrl}</p>
      {notice && <div className="state">{notice}</div>}

      <div className="grid2">
        <article className="panel">
          <h2>폴더</h2>
          <div className={`state ${loading ? 'loading' : error ? 'error' : ''}`}>{statusState(loading, error, folders.length).msg}</div>

          <div className="form-card">
            <b>폴더 생성</b>
            <input placeholder="폴더명" value={createForm.name} onChange={(e) => setCreateForm((v) => ({ ...v, name: e.target.value }))} />
            <input placeholder="설명" value={createForm.description} onChange={(e) => setCreateForm((v) => ({ ...v, description: e.target.value }))} />
            <input type="color" value={createForm.color} onChange={(e) => setCreateForm((v) => ({ ...v, color: e.target.value }))} />
            <button className="btn" type="button" onClick={onCreateFolder}>생성</button>
          </div>

          <div className="folder-list">
            {folders.map((f) => (
              <button
                key={f.id}
                className={`folder-btn ${selectedFolderId === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFolderId(f.id)}
                type="button"
              >
                <span>{f.name}</span>
                <small>{f.description || '-'}</small>
              </button>
            ))}
          </div>

          {folderInfo && (
            <div className="form-card">
              <b>선택 폴더 수정</b>
              <div className="actions">
                <button className="btn" type="button" onClick={onStartEditFolder}>불러오기</button>
                <button className="btn" type="button" onClick={onSaveEditFolder}>저장</button>
                <button className="btn danger" type="button" onClick={onDeleteFolder}>삭제</button>
              </div>
              <input placeholder="폴더명" value={editForm.name} onChange={(e) => setEditForm((v) => ({ ...v, name: e.target.value }))} />
              <input placeholder="설명" value={editForm.description} onChange={(e) => setEditForm((v) => ({ ...v, description: e.target.value }))} />
              <input type="color" value={editForm.color} onChange={(e) => setEditForm((v) => ({ ...v, color: e.target.value }))} />
            </div>
          )}
        </article>

        <article className="panel">
          <h2>문서</h2>
          <div className={`state ${state.cls}`}>{state.msg}</div>

          {folderInfo && (
            <div className="meta-line">
              선택 폴더: <b>{folderInfo.name}</b> · 생성일: {formatKST(folderInfo.createdAt)}
            </div>
          )}

          <div className="form-card">
            <b>문서 업로드</b>
            <input placeholder="문서 제목(선택)" value={uploadForm.title} onChange={(e) => setUploadForm((v) => ({ ...v, title: e.target.value }))} />
            <input type="file" accept=".hwp,.pdf,.xlsx,.xls,.txt" onChange={(e) => setUploadForm((v) => ({ ...v, file: e.target.files?.[0] || null }))} />
            <button className="btn" type="button" onClick={onUpload}>업로드</button>
          </div>

          <div className="filters">
            <input placeholder="문서명 검색" value={filter.title} onChange={(e) => setFilter((v) => ({ ...v, title: e.target.value }))} />
            <select value={filter.category} onChange={(e) => setFilter((v) => ({ ...v, category: e.target.value }))}>
              <option value="">카테고리 전체</option>
              {categories.map((c) => <option value={c} key={c}>{c}</option>)}
            </select>
            <select value={filter.fileType} onChange={(e) => setFilter((v) => ({ ...v, fileType: e.target.value }))}>
              <option value="">형식 전체</option>
              {fileTypes.map((t) => <option value={t} key={t}>{t}</option>)}
            </select>
            <input placeholder="태그 검색" value={filter.tag} onChange={(e) => setFilter((v) => ({ ...v, tag: e.target.value }))} />
            <label className="mini-check-wrap">
              <input type="checkbox" checked={filter.onlyImportant} onChange={(e) => setFilter((v) => ({ ...v, onlyImportant: e.target.checked }))} /> 중요문서
            </label>
            <button className="btn" type="button" onClick={() => setFilter(defaultFilter)}>초기화</button>
          </div>

          <div className="actions" style={{ marginBottom: 8 }}>
            <button className="btn danger" type="button" disabled={checkedDocIds.length === 0} onClick={onBulkDelete}>선택 삭제 ({checkedDocIds.length})</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" checked={filteredDocs.length > 0 && checkedDocIds.length === filteredDocs.length} onChange={(e) => {
                    if (e.target.checked) setCheckedDocIds(filteredDocs.map((d) => d.id))
                    else setCheckedDocIds([])
                  }} /></th>
                  <th><button className="th-btn" onClick={() => setSortKey('important')}>중요 {sortMark('important')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('title')}>문서명 {sortMark('title')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('fileType')}>형식 {sortMark('fileType')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('category')}>카테고리 {sortMark('category')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('uploadedAt')}>수정일 {sortMark('uploadedAt')}</button></th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((d) => (
                  <tr key={d.id}>
                    <td><input type="checkbox" checked={checkedDocIds.includes(d.id)} onChange={(e) => {
                      if (e.target.checked) setCheckedDocIds((v) => [...new Set([...v, d.id])])
                      else setCheckedDocIds((v) => v.filter((id) => id !== d.id))
                    }} /></td>
                    <td>
                      <button className={`star-btn ${d.isImportant ? 'on' : ''}`} onClick={() => onToggleImportant(d)}>{d.isImportant ? '★' : '☆'}</button>
                    </td>
                    <td title={d.fileName}>{d.title}</td>
                    <td>{String(d.fileType || '').toUpperCase()}</td>
                    <td>{d.category || '기타'}</td>
                    <td>{formatKST(d.uploadedAt)}</td>
                    <td>
                      <div className="actions">
                        <button className="btn" type="button" onClick={() => onOpenDetail(d)}>상세</button>
                        <button className="btn danger" type="button" onClick={() => onDeleteOne(d.id)}>삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activeDoc && (
            <div className="detail-box">
              <div className="title-row">
                <h2>문서 상세 · {activeDoc.title}</h2>
                <button className="btn" type="button" onClick={() => setActiveDoc(null)}>닫기</button>
              </div>
              <div className="meta">형식: {activeDoc.fileType} · 수정일: {formatKST(activeDoc.uploadedAt)}</div>
              <div className="meta">요약: {activeDoc.summaryOneLine || '-'}</div>
              <textarea value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder="메모를 입력하세요" rows={4} />
              <div className="actions">
                <button className="btn" type="button" onClick={onSaveMemo}>메모 저장</button>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

function DocsPage() {
  return (
    <section>
      <h1>상태</h1>
      <p className="muted">R3 완료: 쓰기 기능 이관 반영됨</p>
    </section>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
