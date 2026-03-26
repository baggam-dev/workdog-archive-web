import { Link, NavLink } from 'react-router-dom'

export default function PortalLayout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link className="brand" to="/">WORKDOG PORTAL</Link>
          <span className="badge-subtle">Admin</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>포탈 홈</NavLink>
          <NavLink to="/archive">Archive</NavLink>
          <NavLink to="/students">학생관리(예정)</NavLink>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
