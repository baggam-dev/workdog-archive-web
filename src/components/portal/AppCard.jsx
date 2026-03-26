import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

const STATUS_META = {
  운영중: { enabled: true },
  점검중: { enabled: false },
  준비중: { enabled: false },
}

export default function AppCard({ app }) {
  if (!app) return <article className="app-card app-card-empty">빈 슬롯</article>

  const meta = STATUS_META[app.status] || STATUS_META.준비중
  const cardClass = `app-card ${app.featured ? 'app-card-featured' : ''} ${meta.enabled ? 'app-card-link' : 'app-card-disabled'}`

  const inner = (
    <>
      <div className="app-card-top">
        <div className={`app-icon-modern ${app.iconClass || ''}`}>{app.iconText || 'A'}</div>
        <StatusBadge status={app.status} />
      </div>
      <strong className="app-card-title">{app.name}</strong>
      <p className="muted app-card-desc">{app.desc}</p>
    </>
  )

  if (!meta.enabled) return <article className={cardClass} aria-disabled="true">{inner}</article>

  return <Link className={cardClass} to={app.to || '/'}>{inner}</Link>
}
