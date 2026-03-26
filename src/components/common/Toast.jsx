export default function Toast({ type = 'info', message }) {
  if (!message) return null
  return <div className={`toast ${type}`}>{message}</div>
}
