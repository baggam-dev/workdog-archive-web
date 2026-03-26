import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section>
      <h1>Workdog-Archive</h1>
      <p className="muted">포탈 하위 앱(Archive) 대시보드 · R3 기반</p>
      <div className="actions">
        <Link className="btn primary" to="/archive/documents">문서 관리로 이동</Link>
        <Link className="btn" to="/">포탈 홈</Link>
      </div>
    </section>
  )
}
