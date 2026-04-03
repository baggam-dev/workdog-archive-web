export default function LogViewer({ logs = [] }) {
  return (
    <div className="log-viewer">
      {logs.length === 0 ? <p className="muted">로그가 없습니다.</p> : null}
      {logs.map((log, idx) => (
        <div key={`${log.timestamp}-${idx}`} className="log-line">
          <span className="log-time">{new Date(log.timestamp).toLocaleString('ko-KR')}</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  )
}
