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
          <Link to="/folders">폴더/문서 조회</Link>
          <Link to="/docs">문서 목록(준비중)</Link>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}

function HomePage() {
  return (
    <section>
      <h1>Workdog React 전환 R2</h1>
      <p className="muted">조회 기능(폴더/문서/필터/정렬/모바일 카드) 이관 단계입니다.</p>
      <div className="actions">
        <Link className="btn primary" to="/folders">폴더/문서 조회</Link>
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
  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [folderInfo, setFolderInfo] = useState(null)
  const [docs, setDocs] = useState([])
  const [filter, setFilter] = useState(defaultFilter)
  const [sort, setSort] = useState({ key: 'uploadedAt', dir: 'desc' })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const fs = await apiClient.folders()
        if (!mounted) return
        setFolders(Array.isArray(fs) ? fs : [])
        if (fs?.length) setSelectedFolderId(fs[0].id)
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
    if (!selectedFolderId) {
      setFolderInfo(null)
      setDocs([])
      return
    }

    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const [folder, documents] = await Promise.all([
          apiClient.folder(selectedFolderId),
          apiClient.folderDocuments(selectedFolderId),
        ])
        if (!mounted) return
        setFolderInfo(folder)
        setDocs(Array.isArray(documents) ? documents : [])
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

  return (
    <section>
      <h1>폴더/문서 조회</h1>
      <p className="muted">API Base: {apiClient.baseUrl}</p>

      <div className="grid2">
        <article className="panel">
          <h2>폴더 목록</h2>
          <div className={`state ${loading ? 'loading' : error ? 'error' : ''}`}>{statusState(loading, error, folders.length).msg}</div>
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
        </article>

        <article className="panel">
          <h2>문서 목록</h2>
          <div className={`state ${state.cls}`}>{state.msg}</div>

          {folderInfo && (
            <div className="meta-line">
              선택 폴더: <b>{folderInfo.name}</b> · 생성일: {formatKST(folderInfo.createdAt)}
            </div>
          )}

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
              <input type="checkbox" checked={filter.onlyImportant} onChange={(e) => setFilter((v) => ({ ...v, onlyImportant: e.target.checked }))} /> 중요문서만
            </label>
            <button className="btn" type="button" onClick={() => setFilter(defaultFilter)}>초기화</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th><button className="th-btn" onClick={() => setSortKey('important')}>중요 {sortMark('important')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('title')}>문서명 {sortMark('title')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('fileType')}>형식 {sortMark('fileType')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('category')}>카테고리 {sortMark('category')}</button></th>
                  <th><button className="th-btn" onClick={() => setSortKey('uploadedAt')}>수정일 {sortMark('uploadedAt')}</button></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.isImportant ? '★' : '☆'}</td>
                    <td title={d.fileName}>{d.title}</td>
                    <td>{String(d.fileType || '').toUpperCase()}</td>
                    <td>{d.category || '기타'}</td>
                    <td>{formatKST(d.uploadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-list">
            {filteredDocs.map((d) => (
              <article className="card" key={d.id}>
                <div className="title-row">
                  <h2>{d.title}</h2>
                  <span>{d.isImportant ? '★' : '☆'}</span>
                </div>
                <div className="meta">{String(d.fileType || '').toUpperCase()} · {d.category || '기타'}</div>
                <div className="meta">{formatKST(d.uploadedAt)}</div>
                <div className="muted">{(d.summaryOneLine || '-').slice(0, 120)}</div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function DocsPage() {
  return (
    <section>
      <h1>문서 목록</h1>
      <p className="muted">R3에서 쓰기 기능 이관 예정입니다.</p>
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
