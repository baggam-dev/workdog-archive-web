import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section>
      <h1>Workdog React 전환 R3</h1>
      <p className="muted">쓰기 기능(폴더/업로드/중요/메모/삭제) 이관 단계입니다.</p>
      <div className="actions">
        <Link className="btn primary" to="/folders">
          폴더/문서 관리
        </Link>
      </div>
    </section>
  )
}
