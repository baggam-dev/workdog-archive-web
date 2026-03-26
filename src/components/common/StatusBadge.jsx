const STATUS_STYLE = {
  운영중: 'on',
  점검중: 'warn',
  준비중: 'off',
}

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLE[status] || 'off'
  return <span className={`status-dot ${cls}`}>{status}</span>
}
