import { Link } from 'react-router-dom'

const STATUS_META = {
  운영중: { cls: 'on', primaryLabel: '열기', enabled: true },
  점검중: { cls: 'warn', primaryLabel: '점검중', enabled: false },
  준비중: { cls: 'off', primaryLabel: '준비중', enabled: false },
}

export default function AppCard({ app }) {
  if (!app) return <article className="app-card app-card-empty">빈 슬롯</article>

  const meta = STATUS_META[app.status] || STATUS_META.준비중

  return (
    <article className="app-card">
      <div className="app-card-top">
        <strong>{app.name}</strong>
        <span className={`status-dot ${meta.cls}`}>{app.status}</span>
      </div>

      <p className="muted">{app.desc}</p>
      <p className="meta">최근 업데이트: {app.updatedAt || '-'}</p>
      <p className="meta">영역: {app.domain || '-'}</p>

      <div className="actions right-actions">
        {meta.enabled ? (
          <Link className="btn primary" to={app.to || '/'}>{meta.primaryLabel}</Link>
        ) : (
          <button className="btn primary" type="button" disabled>{meta.primaryLabel}</button>
        )}
        <button className="btn" type="button" disabled>{app.secondaryLabel || '상세정보'}</button>
      </div>
    </article>
  )
}
