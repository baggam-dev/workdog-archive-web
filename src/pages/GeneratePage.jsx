import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import InlineState from '../components/common/InlineState'
import { apiClient } from '../lib/apiClient'

function formatPreview(doc) {
  return String(doc?.summaryOneLine || doc?.extractedText || doc?.title || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
}

export default function GeneratePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const documentIds = useMemo(() => {
    const ids = location.state?.documentIds
    return Array.isArray(ids) ? ids.map((v) => String(v)) : []
  }, [location.state])

  const [selectedDocs, setSelectedDocs] = useState([])
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!documentIds.length) {
        setSelectedDocs([])
        setLoading(false)
        setError('선택된 문서가 없습니다. 문서 목록에서 다시 선택해 주세요.')
        setNotice('')
        return
      }

      try {
        setLoading(true)
        setError('')
        setNotice('')
        const docs = await Promise.all(documentIds.map((id) => apiClient.document(id)))
        if (!mounted) return
        setSelectedDocs(docs.filter(Boolean))
      } catch (e) {
        if (!mounted) return
        setError(e?.message || '선택 문서 정보를 불러오지 못했습니다.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [documentIds])

  const onSubmit = async () => {
    if (submitting) return
    if (!prompt.trim()) {
      setError('프롬프트를 입력해 주세요.')
      return
    }
    if (!selectedDocs.length) {
      setError('생성에 사용할 문서가 없습니다.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setNotice('초안을 생성하고 있습니다...')
      const created = await apiClient.generateDocument({
        documentIds: selectedDocs.map((doc) => doc.id),
        prompt: prompt.trim(),
      })
      navigate(`/archive/generated/${created.id}`)
    } catch (e) {
      setError(e?.message || '초안 생성에 실패했습니다.')
      setNotice('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="문서 초안 생성"
        description="선택한 문서를 바탕으로 새 문서 초안을 생성합니다."
        actions={<button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button>}
      />

      <InlineState cls={error ? 'error' : (loading || submitting) ? 'loading' : ''} message={error || notice || (loading ? '선택 문서를 불러오는 중...' : '')} />

      <article className="panel">
        <h2>선택 문서</h2>
        {!loading && selectedDocs.length === 0 ? (
          <p className="muted">선택된 문서가 없습니다.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>문서명</th>
                  <th>형식</th>
                  <th>카테고리</th>
                  <th>미리보기</th>
                </tr>
              </thead>
              <tbody>
                {selectedDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{String(doc.fileType || '').toUpperCase()}</td>
                    <td>{doc.category || '기타'}</td>
                    <td>{formatPreview(doc) || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="panel" style={{ marginTop: 20 }}>
        <h2>생성 요청</h2>
        <div className="form-card" style={{ marginBottom: 0 }}>
          <textarea
            rows={8}
            placeholder="예: 2026 수업계획서 초안 만들어줘"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={submitting}
          />
          <p className="muted">선택한 문서의 추출 텍스트를 우선 사용하고, 없으면 요약이나 제목을 참고해 초안을 만듭니다.</p>
          <div className="actions right-actions">
            <button className="btn primary" type="button" onClick={onSubmit} disabled={submitting || loading || selectedDocs.length === 0}>
              {submitting ? '생성 중...' : '초안 생성'}
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}
