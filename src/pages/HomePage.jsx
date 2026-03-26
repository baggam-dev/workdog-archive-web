import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

export default function HomePage() {
  return (
    <section>
      <PageHeader
        title="Workdog-Archive"
        description="문서 및 폴더 업무를 관리하는 Archive 대시보드"
        actions={(
          <>
            <Link className="btn primary" to="/archive/documents">문서 관리로 이동</Link>
            <Link className="btn" to="/">포탈 홈</Link>
          </>
        )}
      />
    </section>
  )
}
