import PageHeader from '../components/common/PageHeader'
import AppCard from '../components/portal/AppCard'

const apps = [
  {
    key: 'archive',
    name: 'Workdog-Archive',
    desc: '문서 보관/검색/요약 업무 앱',
    status: '운영중',
    to: '/archive',
    updatedAt: '2026-03-26',
    secondaryLabel: '앱 소개',
  },
  {
    key: 'students',
    name: '학생관리',
    desc: '학생 정보 및 상담 관리',
    status: '준비중',
    to: '/students',
    updatedAt: '-',
    secondaryLabel: '준비중',
  },
  {
    key: 'app3',
    name: '추후 추가 앱',
    desc: '업무 자동화 앱 슬롯',
    status: '준비중',
    to: '/apps',
    updatedAt: '-',
    secondaryLabel: '준비중',
  },
]

export default function PortalHomePage() {
  return (
    <section>
      <PageHeader title="Workdog 포탈" description="업무 앱 실행 허브 · 3x3 카드 레이아웃(2차)" />

      <div className="app-grid">
        {Array.from({ length: 9 }).map((_, idx) => {
          const app = apps[idx]
          return <AppCard key={app?.key || `empty-${idx}`} app={app} />
        })}
      </div>
    </section>
  )
}
