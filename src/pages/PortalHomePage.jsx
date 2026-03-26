import { Link } from 'react-router-dom'

const apps = [
  { key: 'archive', name: 'Workdog-Archive', desc: '문서 보관/검색/요약 업무 앱', status: '운영중', to: '/archive' },
  { key: 'students', name: '학생관리', desc: '학생 정보 및 상담 관리', status: '준비중', to: '/students' },
  { key: 'app3', name: '추후 추가 앱', desc: '업무 자동화 앱 슬롯', status: '준비중', to: '/apps' },
]

export default function PortalHomePage() {
  return (
    <section>
      <h1>Workdog 포탈</h1>
      <p className="muted">업무 앱 실행 허브 · 3x3 카드 레이아웃(1차)</p>

      <div className="app-grid">
        {Array.from({ length: 9 }).map((_, idx) => {
          const app = apps[idx]
          if (!app) return <article className="app-card app-card-empty" key={`empty-${idx}`}>빈 슬롯</article>
          return (
            <article className="app-card" key={app.key}>
              <div className="app-card-top">
                <strong>{app.name}</strong>
                <span className={`status-dot ${app.status === '운영중' ? 'on' : 'off'}`}>{app.status}</span>
              </div>
              <p className="muted">{app.desc}</p>
              <div className="actions right-actions">
                <Link className="btn primary" to={app.to}>열기</Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
