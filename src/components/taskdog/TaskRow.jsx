import StatusBadge from './StatusBadge'

export default function TaskRow({ task, isActive, onClick }) {
  const currentStep = task.steps?.find((s) => s.status === 'running' || s.status === 'retrying')
    || task.steps?.find((s) => s.status === 'error')
    || task.steps?.find((s) => s.status === 'pending')
    || task.steps?.[task.steps.length - 1]

  return (
    <tr className={`task-row ${isActive ? 'active' : ''}`} onClick={() => onClick(task)}>
      <td className="mono ellipsis">{task.id}</td>
      <td>{task.type}</td>
      <td><StatusBadge status={task.status} /></td>
      <td className="ellipsis">{currentStep?.name || '-'}</td>
      <td>{task.retryCount}</td>
      <td>{new Date(task.updatedAt).toLocaleString('ko-KR')}</td>
    </tr>
  )
}
