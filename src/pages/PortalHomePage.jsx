import { useEffect, useState } from 'react'
import AppCard from '../components/portal/AppCard'
import { apiClient } from '../lib/apiClient'

const apps = [
  {
    key: 'archive',
    iconText: 'A',
    iconClass: 'app-icon-archive',
    name: 'Workdog-Archive',
    desc: '문서 보관/검색/요약 업무 앱',
    status: '운영중',
    to: '/archive',
  },
  {
    key: 'students',
    iconText: 'S',
    iconClass: 'app-icon-students',
    name: '학생관리',
    desc: '학생 정보 및 상담 관리',
    status: '준비중',
    to: '/students',
  },
  {
    key: 'app3',
    iconText: 'X',
    iconClass: 'app-icon-default',
    name: '추후 추가 앱',
    desc: '업무 자동화 앱 슬롯',
    status: '점검중',
    to: '/apps',
  },
]

export default function PortalHomePage() {
  const [summary, setSummary] = useState({
    runningCount: 0,
    failedCount: 0,
    completedToday: 0,
    recentTasks: [],
  })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await apiClient.taskSummary()
        if (!mounted) return
        setSummary({
          runningCount: Number(data?.runningCount || 0),
          failedCount: Number(data?.failedCount || 0),
          completedToday: Number(data?.completedToday || 0),
          recentTasks: Array.isArray(data?.recentTasks) ? data.recentTasks.slice(0, 5) : [],
        })
      } catch {
        // 위젯 실패 시 포털 렌더는 유지
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const goTaskCenter = () => {
    const url = import.meta.env.VITE_TASK_CENTER_URL || '/taskdog'
    window.location.assign(url)
  }

  return (
    <section className="portal-home">
      <div className="page-hero">
        <h1 className="page-title">업무 앱 선택</h1>
        <p className="page-description">프로젝트별 업무 도구에 빠르게 접근하세요</p>
      </div>

      <button type="button" className="task-summary-widget" onClick={goTaskCenter}>
        <div className="task-summary-head">
          <h3>Task Summary</h3>
          <span>클릭하여 Task Center 이동 →</span>
        </div>
        <div className="task-summary-stats">
          <div><small>running tasks</small><strong>{summary.runningCount}</strong></div>
          <div><small>failed tasks</small><strong>{summary.failedCount}</strong></div>
          <div><small>completed today</small><strong>{summary.completedToday}</strong></div>
        </div>
        <div className="task-summary-recent">
          <small>recent tasks (top 5)</small>
          <ul>
            {summary.recentTasks.map((task) => (
              <li key={task.id}>
                <span className="mono">{task.id}</span>
                <b>{task.status}</b>
              </li>
            ))}
            {summary.recentTasks.length === 0 ? <li>최근 태스크 없음</li> : null}
          </ul>
        </div>
      </button>

      <div className="app-grid">
        {Array.from({ length: 9 }).map((_, idx) => {
          const app = apps[idx]
          return <AppCard key={app?.key || `empty-${idx}`} app={app} />
        })}
      </div>
    </section>
  )
}
