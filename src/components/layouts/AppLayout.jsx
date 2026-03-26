import { NavLink } from 'react-router-dom'

function NavIcon({ children }) {
  return <span className="nav-item-icon" aria-hidden="true">{children}</span>
}

export default function AppLayout({ appName, children }) {
  return (
    <section className="app-shell">
      <aside className="app-sidenav">
        <h3>{appName}</h3>
        <nav className="app-nav">
          <NavLink to="/archive" end><NavIcon>⌂</NavIcon> 대시보드</NavLink>
          <NavLink to="/archive/documents"><NavIcon>▦</NavIcon> 문서 관리</NavLink>
          <NavLink to="/archive/folders"><NavIcon>◫</NavIcon> 폴더 관리</NavLink>
          <NavLink to="/archive/status"><NavIcon>◉</NavIcon> 상태</NavLink>
          <button className="nav-disabled" type="button" disabled><NavIcon>⚡</NavIcon> 파이프라인 (준비중)</button>
        </nav>
      </aside>
      <div className="app-content">{children}</div>
    </section>
  )
}
