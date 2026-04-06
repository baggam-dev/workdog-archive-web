import { useEffect, useMemo, useState } from 'react'
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
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('updatedAt')

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

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = docs.filter((doc) => {
      if (!q) return true
      return [doc.title, doc.prompt, ...(doc.sourceDocumentsPreview || []).map((item) => item.title)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    })

    list.sort((a, b) => {
      if (sortKey === 'title') return String(a.title || '').localeCompare(String(b.title || ''), 'ko')
      if (sortKey === 'createdAt') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
    })

    return list
  }, [docs, query, sortKey])

  return (
    <section>
      <PageHeader
        title="생성 문서 목록"
        description="저장된 생성 초안을 다시 찾고 빠르게 열어볼 수 있습니다."
        actions={<div className="actions"><button className="btn secondary" type="button" onClick={() => navigate('/archive/generate')}>새 초안 생성</button><button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button></div>}
      />

      <InlineState cls={error ? 'error' : loading ? 'loading' : ''} message={error || (loading ? '생성 문서 목록을 불러오는 중...' : '')} />

      {!loading && !error && (
        <article className="panel">
          <div className="title-row">
            <h2>생성 문서</h2>
            <div className="actions">
              <input placeholder="제목/프롬프트/원본 문서 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="updatedAt">최근 수정순</option>
                <option value="createdAt">생성일순</option>
                <option value="title">제목순</option>
              </select>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
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
                    <th>수정일</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} onClick={() => navigate(`/archive/generated/${doc.id}`)} style={{ cursor: 'pointer' }}>
                      <td>{doc.title || '제목 없음'}</td>
                      <td>{shortPrompt(doc.prompt)}</td>
                      <td>{Array.isArray(doc.sourceDocumentIds) ? doc.sourceDocumentIds.length : 0}</td>
                      <td>{formatKST(doc.createdAt)}</td>
                      <td>{formatKST(doc.updatedAt || doc.createdAt)}</td>
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
