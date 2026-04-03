import TaskRow from './TaskRow'

export default function TaskTable({ tasks, selectedTaskId, onRowClick }) {
  return (
    <div className="table-wrap">
      <table className="task-table">
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
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isActive={selectedTaskId === task.id}
              onClick={onRowClick}
            />
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={6} className="task-empty">표시할 태스크가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
