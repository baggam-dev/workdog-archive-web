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

const defaultArchiveNav = [
  { to: '/archive', label: '대시보드', icon: 'home', end: true },
  { to: '/archive/documents', label: '문서 관리', icon: 'docs' },
  { to: '/archive/folders', label: '폴더 관리', icon: 'folder' },
  { to: '/archive/status', label: '상태', icon: 'status' },
  { disabled: true, label: '파이프라인 (준비중)', icon: 'bolt' },
]

export default function AppLayout({ appName, children, navItems = defaultArchiveNav }) {
  return (
    <section className="app-shell">
      <aside className="app-sidenav">
        <h3>{appName}</h3>
        <nav className="app-nav">
          {navItems.map((item) => {
            if (item.disabled) {
              return <button key={item.label} className="nav-disabled" type="button" disabled><NavIcon type={item.icon} /> {item.label}</button>
            }
            return <NavLink key={item.to} to={item.to} end={item.end}><NavIcon type={item.icon} /> {item.label}</NavLink>
          })}
        </nav>
      </aside>
      <div className="app-content">{children}</div>
    </section>
  )
}
