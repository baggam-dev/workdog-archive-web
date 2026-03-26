import { Link } from 'react-router-dom'

export default function Layout({ children }) {
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
