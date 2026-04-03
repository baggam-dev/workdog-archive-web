import StatusBadge from './StatusBadge'
import StepTimeline from './StepTimeline'
import LogViewer from './LogViewer'

export default function TaskDetailDrawer({ task, onClose, onRetry }) {
  if (!task) return null

  return (
    <aside className="task-drawer-backdrop" onClick={onClose}>
      <section className="task-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="task-drawer-head">
          <div>
            <h3>Task Detail</h3>
            <p className="mono">{task.id}</p>
          </div>
          <button className="btn ghost" type="button" onClick={onClose}>닫기</button>
        </header>

        <div className="task-info-grid">
          <div><b>Type</b><p>{task.type}</p></div>
          <div><b>Status</b><p><StatusBadge status={task.status} /></p></div>
          <div><b>Retry Count</b><p>{task.retryCount}</p></div>
          <div><b>Updated At</b><p>{new Date(task.updatedAt).toLocaleString('ko-KR')}</p></div>
        </div>

        <div className="task-section">
          <div className="task-section-head">
            <h4>Step Timeline</h4>
          </div>
          <StepTimeline steps={task.steps} />
        </div>

        <div className="task-section">
          <h4>Logs</h4>
          <LogViewer logs={task.logs} />
        </div>

        <div className="right-actions">
          <button className="btn secondary" type="button" onClick={() => onRetry(task.id)}>재시도</button>
        </div>
      </section>
    </aside>
  )
}
