import { Link, NavLink } from 'react-router-dom'

function SvgIcon({ children }) {
  return (
    <span className="ui-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  )
}

function HomeIcon() {
  return <SvgIcon><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></SvgIcon>
}
function ArchiveIcon() {
  return <SvgIcon><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></SvgIcon>
}
function UsersIcon() {
  return <SvgIcon><path d="M16 20a4 4 0 0 0-8 0" /><circle cx="12" cy="10" r="3" /></SvgIcon>
}
function BellIcon() {
  return <SvgIcon><path d="M15 17H5l1.2-1.5A5 5 0 0 0 7 12V10a5 5 0 1 1 10 0v2a5 5 0 0 0 .8 2.7L19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></SvgIcon>
}
function SettingsIcon() {
  return <SvgIcon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.4 1.6" /></SvgIcon>
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
