import { Link } from 'react-router-dom'

const STATUS_META = {
  운영중: { cls: 'on', enabled: true },
  점검중: { cls: 'warn', enabled: false },
  준비중: { cls: 'off', enabled: false },
}

export default function AppCard({ app }) {
  if (!app) return <article className="app-card app-card-empty">빈 슬롯</article>

  const meta = STATUS_META[app.status] || STATUS_META.준비중

  if (!meta.enabled) {
    return (
      <article className="app-card app-card-disabled" aria-disabled="true">
        <div className="app-card-top">
          <strong>{app.name}</strong>
          <span className={`status-dot ${meta.cls}`}>{app.status}</span>
        </div>
        <p className="muted">{app.desc}</p>
      </article>
    )
  }

  return (
    <Link className="app-card app-card-link" to={app.to || '/'}>
      <div className="app-card-top">
        <strong>{app.name}</strong>
        <span className={`status-dot ${meta.cls}`}>{app.status}</span>
      </div>
      <p className="muted">{app.desc}</p>
    </Link>
  )
}
