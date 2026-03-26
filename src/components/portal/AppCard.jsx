import { Link } from 'react-router-dom'

function statusClass(status) {
  if (status === '운영중') return 'on'
  if (status === '점검중') return 'warn'
  return 'off'
}

export default function AppCard({ app }) {
  if (!app) return <article className="app-card app-card-empty">빈 슬롯</article>

  return (
    <article className="app-card">
      <div className="app-card-top">
        <strong>{app.name}</strong>
        <span className={`status-dot ${statusClass(app.status)}`}>{app.status}</span>
      </div>

      <p className="muted">{app.desc}</p>
      <p className="meta">최근 업데이트: {app.updatedAt || '-'}</p>

      <div className="actions right-actions">
        <Link className="btn primary" to={app.to || '/'}>열기</Link>
        <button className="btn" type="button" disabled>{app.secondaryLabel || '준비중'}</button>
      </div>
    </article>
  )
}
