function StatIcon({ kind }) {
  const map = {
    docs: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
    important: <><path d="m12 3 2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.3l6-.9z" /></>,
    selected: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 2.5 2.5L16 9" /></>,
  }
  return (
    <span className="summary-stat-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {map[kind]}
      </svg>
    </span>
  )
}

export default function SummaryStat({ label, value, icon = 'docs' }) {
  return (
    <article className="summary-stat">
      <StatIcon kind={icon} />
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value}</strong>
    </article>
  )
}
