export default function SummaryStat({ label, value, icon = '◉' }) {
  return (
    <article className="summary-stat">
      <div className="summary-stat-icon" aria-hidden="true">{icon}</div>
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value}</strong>
    </article>
  )
}
