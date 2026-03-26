export default function InlineState({ cls = '', message = '' }) {
  return <div className={`state ${cls}`}>{message}</div>
}
