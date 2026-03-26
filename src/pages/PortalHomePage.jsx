import AppCard from '../components/portal/AppCard'

const apps = [
  {
    key: 'archive',
    iconText: 'A',
    iconClass: 'app-icon-archive',
    name: 'Workdog-Archive',
    desc: '문서 보관/검색/요약 업무 앱',
    status: '운영중',
    to: '/archive',
    featured: true,
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
  return (
    <section className="portal-home">
      <div className="page-hero">
        <h1 className="page-title">업무 앱 선택</h1>
        <p className="page-description">프로젝트별 업무 도구에 빠르게 접근하세요</p>
      </div>

      <div className="app-grid">
        {Array.from({ length: 9 }).map((_, idx) => {
          const app = apps[idx]
          return <AppCard key={app?.key || `empty-${idx}`} app={app} />
        })}
      </div>
    </section>
  )
}
