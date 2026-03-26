import { NavLink } from 'react-router-dom'

function NavIcon({ type }) {
  const map = {
    home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
    docs: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
    folder: <><path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
    status: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
    bolt: <><path d="m13 3-7 10h5l-1 8 8-11h-5z" /></>,
  }
  return (
    <span className="nav-item-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {map[type]}
      </svg>
    </span>
  )
}

export default function AppLayout({ appName, children }) {
  return (
    <section className="app-shell">
      <aside className="app-sidenav">
        <h3>{appName}</h3>
        <nav className="app-nav">
          <NavLink to="/archive" end><NavIcon type="home" /> 대시보드</NavLink>
          <NavLink to="/archive/documents"><NavIcon type="docs" /> 문서 관리</NavLink>
          <NavLink to="/archive/folders"><NavIcon type="folder" /> 폴더 관리</NavLink>
          <NavLink to="/archive/status"><NavIcon type="status" /> 상태</NavLink>
          <button className="nav-disabled" type="button" disabled><NavIcon type="bolt" /> 파이프라인 (준비중)</button>
        </nav>
      </aside>
      <div className="app-content">{children}</div>
    </section>
  )
}
