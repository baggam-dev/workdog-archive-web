import PageHeader from '../components/common/PageHeader'
import AppCard from '../components/portal/AppCard'

const apps = [
  {
    key: 'archive',
    icon: '🐶',
    name: 'Workdog-Archive',
    desc: '문서 보관/검색/요약 업무 앱',
    status: '운영중',
    to: '/archive',
  },
  {
    key: 'students',
    icon: '🎓',
    name: '학생관리',
    desc: '학생 정보 및 상담 관리',
    status: '준비중',
    to: '/students',
  },
  {
    key: 'app3',
    icon: '🧩',
    name: '추후 추가 앱',
    desc: '업무 자동화 앱 슬롯',
    status: '점검중',
    to: '/apps',
  },
]

export default function PortalHomePage() {
  return (
    <section>
      <PageHeader title="Workdog 포탈" description="앱을 선택하면 바로 진입합니다." />

      <div className="app-grid">
        {Array.from({ length: 9 }).map((_, idx) => {
          const app = apps[idx]
          return <AppCard key={app?.key || `empty-${idx}`} app={app} />
        })}
      </div>
    </section>
  )
}
