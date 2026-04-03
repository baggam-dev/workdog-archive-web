import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'
import { apiClient } from '../lib/apiClient'
import TaskTable from '../components/taskdog/TaskTable'
import TaskDetailDrawer from '../components/taskdog/TaskDetailDrawer'

const STATUS_OPTIONS = ['', 'pending', 'running', 'retrying', 'done', 'error']

export default function TaskdogPage() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [notice, setNotice] = useState({ type: '', message: '' })

  const loadTasks = async () => {
    const list = await apiClient.tasks({ status: statusFilter || undefined })
    setTasks(Array.isArray(list) ? list : [])
  }

  useEffect(() => {
    loadTasks().catch((e) => setNotice({ type: 'error', message: e.message || '태스크 조회 실패' }))
    const timer = setInterval(() => {
      loadTasks().catch(() => {})
    }, 3000)
    return () => clearInterval(timer)
  }, [statusFilter])

  const selectedTaskId = selectedTask?.id || ''

  const syncedSelectedTask = useMemo(() => {
    if (!selectedTaskId) return null
    return tasks.find((t) => t.id === selectedTaskId) || selectedTask
  }, [tasks, selectedTask, selectedTaskId])

  const onRetry = async (taskId) => {
    try {
      await apiClient.retryTask(taskId)
      setNotice({ type: 'info', message: '재시도 요청을 보냈습니다.' })
      await loadTasks()
      const detail = await apiClient.task(taskId)
      setSelectedTask(detail)
    } catch (e) {
      setNotice({ type: 'error', message: e.message || '재시도 실패' })
    }
  }

  const onClickRow = async (task) => {
    setSelectedTask(task)
    try {
      const detail = await apiClient.task(task.id)
      setSelectedTask(detail)
    } catch {
      // noop
    }
  }

  return (
    <section>
      <PageHeader
        title="Taskdog"
        description="업로드 문서 처리 태스크 모니터링"
        actions={(
          <div className="actions">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s || 'all'} value={s}>{s || 'all status'}</option>)}
            </select>
            <button type="button" className="btn secondary" onClick={loadTasks}>새로고침</button>
          </div>
        )}
      />

      <Toast type={notice.type} message={notice.message} />
      <TaskTable tasks={tasks} selectedTaskId={selectedTaskId} onRowClick={onClickRow} />
      <TaskDetailDrawer task={syncedSelectedTask} onClose={() => setSelectedTask(null)} onRetry={onRetry} />
    </section>
  )
}
