export default function InlineState({ cls = '', message = '' }) {
  if (!message) return null
  return <div className={`state ${cls}`}>{message}</div>
}
