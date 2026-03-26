export default function SummaryStat({ label, value }) {
  return (
    <article className="summary-stat">
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value}</strong>
    </article>
  )
}
