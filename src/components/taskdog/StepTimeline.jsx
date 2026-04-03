export default function StepTimeline({ steps = [] }) {
  return (
    <ol className="step-timeline">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`step-item ${step.status} ${step.status === 'running' || step.status === 'retrying' ? 'current' : ''}`}
        >
          <div className="step-head">
            <strong>{step.name}</strong>
            <span>{step.status}</span>
          </div>
          <div className="step-tool">tool: {step.tool}</div>
          {step.error ? <p className="step-error">error: {step.error}</p> : null}
        </li>
      ))}
    </ol>
  )
}
