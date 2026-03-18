import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/apiClient'
import './App.css'

function Layout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">WORKDOG ARCHIVE WEB</div>
        <nav className="nav">
          <Link to="/">홈</Link>
          <Link to="/folders">폴더 목록</Link>
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
      <h1>Workdog React 전환 셸</h1>
      <p className="muted">R1 단계: 라우트/레이아웃/API 클라이언트 연결 확인</p>
      <div className="actions">
        <Link className="btn primary" to="/folders">폴더 조회 테스트</Link>
      </div>
    </section>
  )
}

function FoldersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [folders, setFolders] = useState([])

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError('')
        const data = await apiClient.folders()
        if (mounted) setFolders(Array.isArray(data) ? data : [])
      } catch (e) {
        if (mounted) setError(e.message || '오류가 발생했습니다')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section>
      <h1>폴더 목록</h1>
      <p className="muted">API Base: {apiClient.baseUrl}</p>
      {loading && <div className="state loading">폴더 목록을 불러오는 중...</div>}
      {error && <div className="state error">로드 실패: {error}</div>}
      {!loading && !error && folders.length === 0 && <div className="state">폴더가 없습니다.</div>}

      {!loading && !error && folders.length > 0 && (
        <div className="list">
          {folders.map((f) => (
            <article className="card" key={f.id}>
              <div className="title-row">
                <h2>{f.name}</h2>
                <span className="badge" style={{ borderColor: f.color || '#d1d5db' }}>{f.color || '#-'} </span>
              </div>
              <p className="muted">{f.description || '-'}</p>
              <div className="meta">ID: {f.id}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function DocsPage() {
  return (
    <section>
      <h1>문서 목록</h1>
      <p className="muted">R2에서 본격 구현 예정입니다.</p>
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
