import { Link, NavLink } from 'react-router-dom'

function HomeIcon() {
  return <span aria-hidden="true">⌂</span>
}
function ArchiveIcon() {
  return <span aria-hidden="true">▦</span>
}
function UsersIcon() {
  return <span aria-hidden="true">◉</span>
}
function BellIcon() {
  return <span aria-hidden="true">◌</span>
}
function SettingsIcon() {
  return <span aria-hidden="true">⚙</span>
}

export default function PortalLayout({ children }) {
  return (
    <div className="shell">
      <header className="portal-header">
        <div className="brand-area">
          <div className="brand-icon">W</div>
          <div>
            <Link className="brand-title" to="/">Workdog</Link>
            <span className="brand-subtitle">Admin Portal</span>
          </div>
        </div>

        <nav className="main-nav">
          <NavLink to="/" end><HomeIcon /> 홈</NavLink>
          <NavLink to="/archive"><ArchiveIcon /> Archive</NavLink>
          <NavLink to="/students"><UsersIcon /> 학생관리</NavLink>
        </nav>

        <div className="header-actions">
          <button className="btn-icon" type="button" aria-label="알림"><BellIcon /></button>
          <button className="btn-icon" type="button" aria-label="설정"><SettingsIcon /></button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
