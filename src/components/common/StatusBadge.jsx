const STATUS_STYLE = {
  운영중: 'active',
  점검중: 'maintenance',
  준비중: 'upcoming',
}

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLE[status] || 'upcoming'
  return <span className={`status-badge-modern ${cls}`}>{status}</span>
}
