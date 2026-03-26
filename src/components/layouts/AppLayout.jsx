import { NavLink } from 'react-router-dom'

export default function AppLayout({ appName, children }) {
  return (
    <section className="app-shell">
      <aside className="app-sidenav">
        <h3>{appName}</h3>
        <nav className="app-nav">
          <NavLink to="/archive" end>대시보드</NavLink>
          <NavLink to="/archive/documents">문서 관리</NavLink>
          <NavLink to="/archive/folders">폴더 관리</NavLink>
          <NavLink to="/archive/status">상태</NavLink>
          <button className="nav-disabled" type="button" disabled>파이프라인 (준비중)</button>
        </nav>
      </aside>
      <div className="app-content">{children}</div>
    </section>
  )
}
