import constructionImage from '../assets/under-construction.svg'

export default function ComingSoonPage({
  title = '준비중',
  description = '현재 페이지는 Figma 기준으로 UI만 반영된 준비중 화면입니다.',
}) {
  return (
    <section>
      <div className="coming-alert">⚠ 준비중: 해당 메뉴는 현재 기능 개발 중입니다.</div>

      <div className="page-hero" style={{ marginBottom: 24 }}>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>

      <article className="panel coming-panel">
        <img src={constructionImage} alt="공사중 안내 이미지" className="coming-image" />
        <p className="muted" style={{ marginTop: 12 }}>공사중 안내 화면은 공통 컴포넌트로 관리됩니다.</p>
      </article>
    </section>
  )
}
