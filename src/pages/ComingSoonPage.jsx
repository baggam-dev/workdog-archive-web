import constructionImage from '../assets/under-construction.svg'

export default function ComingSoonPage({ title = '준비중 페이지', description = '현재 공사중입니다.' }) {
  return (
    <section>
      <div className="coming-alert">⚠ 준비중: 해당 페이지는 현재 개발 중입니다.</div>

      <div className="page-hero" style={{ marginBottom: 24 }}>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>

      <article className="panel coming-panel">
        <img src={constructionImage} alt="공사중 안내 이미지" className="coming-image" />
        <p className="muted" style={{ marginTop: 12 }}>디자인은 선반영되었으며 기능 연결은 순차적으로 진행됩니다.</p>
      </article>
    </section>
  )
}
