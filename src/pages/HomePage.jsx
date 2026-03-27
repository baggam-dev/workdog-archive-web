import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

export default function HomePage() {
  return (
    <section>
      <div className="coming-alert">⚠ 샘플데이터 준비중: 현재 대시보드는 Figma 기준 UI 목업 화면입니다.</div>

      <PageHeader
        title="Workdog-Archive 대시보드"
        description="문서/폴더 운영 현황을 한눈에 보는 준비중 대시보드"
        actions={(
          <>
            <Link className="btn primary" to="/archive/documents">문서 관리로 이동</Link>
            <Link className="btn secondary" to="/archive/folders">폴더 관리</Link>
          </>
        )}
      />

      <div className="mock-grid-3">
        <article className="mock-card">
          <p className="mock-label">전체 문서</p>
          <strong className="mock-value">52</strong>
        </article>
        <article className="mock-card">
          <p className="mock-label">중요 문서</p>
          <strong className="mock-value">12</strong>
        </article>
        <article className="mock-card">
          <p className="mock-label">오늘 업로드</p>
          <strong className="mock-value">3</strong>
        </article>
      </div>

      <article className="panel" style={{ marginTop: 20 }}>
        <div className="mock-toolbar">
          <div className="mock-input">문서 제목 / 태그 검색...</div>
          <div className="actions">
            <button className="btn secondary" type="button">필터</button>
            <button className="btn primary" type="button">새 문서 등록</button>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>문서명</th>
                <th>형식</th>
                <th>카테고리</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>운영계획서.hwp</td><td>HWP</td><td>계획서</td><td>2026-03-27</td></tr>
              <tr><td>회의록.pdf</td><td>PDF</td><td>회의자료</td><td>2026-03-26</td></tr>
              <tr><td>업무현황.xlsx</td><td>XLSX</td><td>결과보고</td><td>2026-03-25</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
