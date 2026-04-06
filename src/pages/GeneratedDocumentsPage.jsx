import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import InlineState from '../components/common/InlineState'
import EmptyState from '../components/common/EmptyState'
import { apiClient } from '../lib/apiClient'

function formatKST(iso) {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return iso || '-'
  }
}

function shortPrompt(prompt) {
  return String(prompt || '').replace(/\s+/g, ' ').trim().slice(0, 100) || '-'
}

export default function GeneratedDocumentsPage() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await apiClient.generatedDocuments()
        if (!mounted) return
        setDocs(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!mounted) return
        setError(e?.message || '생성 문서 목록을 불러오지 못했습니다.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section>
      <PageHeader
        title="생성 문서 목록"
        description="저장된 생성 초안을 다시 열어볼 수 있습니다."
        actions={<button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button>}
      />

      <InlineState cls={error ? 'error' : loading ? 'loading' : ''} message={error || (loading ? '생성 문서 목록을 불러오는 중...' : '')} />

      {!loading && !error && (
        <article className="panel">
          <h2>생성 문서</h2>
          {docs.length === 0 ? (
            <EmptyState title="생성된 문서가 없습니다." description="문서 목록에서 문서를 선택한 뒤 초안을 생성해 보세요." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>프롬프트</th>
                    <th>참고 문서 수</th>
                    <th>생성일</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} onClick={() => navigate(`/archive/generated/${doc.id}`)} style={{ cursor: 'pointer' }}>
                      <td>{doc.title || '제목 없음'}</td>
                      <td>{shortPrompt(doc.prompt)}</td>
                      <td>{Array.isArray(doc.sourceDocumentIds) ? doc.sourceDocumentIds.length : 0}</td>
                      <td>{formatKST(doc.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      )}
    </section>
  )
}
