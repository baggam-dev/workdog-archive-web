const STATUS_LABEL = {
  pending: '대기',
  running: '실행중',
  retrying: '재시도중',
  done: '완료',
  error: '실패',
}

export default function StatusBadge({ status }) {
  const safe = STATUS_LABEL[status] ? status : 'pending'
  return <span className={`task-status-badge ${safe}`}>{STATUS_LABEL[safe]}</span>
}
