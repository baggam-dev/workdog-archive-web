const mockTasks = [
  { id: 'tsk_9a12f', type: 'archive.document.process', status: 'running', step: 'extract text', retry: 0, updated: '2026-04-03 16:58' },
  { id: 'tsk_7bd33', type: 'archive.document.process', status: 'retrying', step: 'summarize', retry: 1, updated: '2026-04-03 16:56' },
  { id: 'tsk_4ce21', type: 'archive.document.process', status: 'done', step: 'save result', retry: 0, updated: '2026-04-03 16:53' },
  { id: 'tsk_2de90', type: 'archive.document.process', status: 'error', step: 'extract text', retry: 2, updated: '2026-04-03 16:51' },
]

const timeline = [
  { name: 'save file', status: 'done' },
  { name: 'extract text', status: 'running' },
  { name: 'summarize', status: 'pending' },
  { name: 'generate metadata', status: 'pending' },
  { name: 'save result', status: 'pending' },
]

function Badge({ status }) {
  return <span className={`taskdog-badge ${status}`}>{status}</span>
}

export default function TaskdogMockPage() {
  return (
    <section>
      <div className="page-header">
        <h1>Taskdog</h1>
        <p className="muted">Figma 기반 목업 화면 (데이터 연결 전)</p>
      </div>

      <div className="taskdog-summary-row">
        <article className="taskdog-kpi"><small>Running</small><strong>12</strong></article>
        <article className="taskdog-kpi"><small>Failed</small><strong>3</strong></article>
        <article className="taskdog-kpi"><small>Completed Today</small><strong>47</strong></article>
      </div>

      <section className="taskdog-mock-grid">
        <article className="taskdog-card">
          <div className="taskdog-table-head">
            <h3>Task List</h3>
            <div className="taskdog-actions">
              <button className="btn secondary" type="button">Status Filter</button>
              <button className="btn secondary" type="button">Refresh</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>task_id</th>
                  <th>type</th>
                  <th>status</th>
                  <th>current_step</th>
                  <th>retry_count</th>
                  <th>updated_at</th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map((task) => (
                  <tr key={task.id} className="taskdog-row">
                    <td className="mono">{task.id}</td>
                    <td>{task.type}</td>
                    <td><Badge status={task.status} /></td>
                    <td className={task.status === 'running' ? 'taskdog-current-step' : ''}>{task.step}</td>
                    <td>{task.retry}</td>
                    <td>{task.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="taskdog-card taskdog-drawer-mock">
          <div className="taskdog-drawer-head">
            <h3>Task Detail</h3>
            <button className="btn ghost" type="button">닫기</button>
          </div>

          <div className="taskdog-info-grid">
            <div><small>Task ID</small><p className="mono">tsk_9a12f</p></div>
            <div><small>Status</small><p><Badge status="running" /></p></div>
            <div><small>Type</small><p>archive.document.process</p></div>
            <div><small>Retry Count</small><p>0</p></div>
          </div>

          <div>
            <h4>Step Timeline</h4>
            <ol className="taskdog-step-list">
              {timeline.map((step) => (
                <li key={step.name} className={step.status === 'running' ? 'current' : ''}>
                  <span>{step.name}</span>
                  <Badge status={step.status} />
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4>Logs</h4>
            <div className="taskdog-log-box">
              <p>[16:58:00] [extract-text] started</p>
              <p>[16:58:01] hwp5txt extractor selected</p>
              <p>[16:58:06] text length: 9,430</p>
            </div>
          </div>

          <div className="right-actions">
            <button className="btn secondary" type="button">Retry</button>
          </div>
        </aside>
      </section>
    </section>
  )
}
