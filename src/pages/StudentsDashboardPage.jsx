export default function StudentsDashboardPage() {
  return (
    <section>
      <div className="coming-alert">⚠ 준비중: 이 대시보드는 현재 UI 목업 단계이며 기능은 추후 연결됩니다.</div>

      <div className="page-hero" style={{ marginBottom: 24 }}>
        <h1 className="page-title">학생관리 대시보드</h1>
        <p className="page-description">피그마 기준 레이아웃 미리보기 화면입니다.</p>
      </div>

      <div className="mock-grid-3">
        <article className="mock-card">
          <p className="mock-label">전체 학생</p>
          <strong className="mock-value">124</strong>
        </article>
        <article className="mock-card">
          <p className="mock-label">상담 예정</p>
          <strong className="mock-value">18</strong>
        </article>
        <article className="mock-card">
          <p className="mock-label">미납 서류</p>
          <strong className="mock-value">7</strong>
        </article>
      </div>

      <article className="panel" style={{ marginTop: 20 }}>
        <div className="mock-toolbar">
          <div className="mock-input">학생 이름/학번 검색...</div>
          <div className="actions">
            <button className="btn secondary" type="button">필터</button>
            <button className="btn primary" type="button">학생 등록</button>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>학년</th>
                <th>상태</th>
                <th>최근 상담일</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>김OO</td><td>2학년</td><td>재학</td><td>2026-03-24</td></tr>
              <tr><td>박OO</td><td>3학년</td><td>재학</td><td>2026-03-22</td></tr>
              <tr><td>이OO</td><td>1학년</td><td>휴학</td><td>2026-03-19</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
