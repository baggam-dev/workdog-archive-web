import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import InlineState from '../components/common/InlineState'
import { apiClient } from '../lib/apiClient'

export default function GeneratedDocumentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!id) {
        setError('생성 문서 id가 없습니다.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await apiClient.generatedDocument(id)
        if (!mounted) return
        setDoc(data)
      } catch (e) {
        if (!mounted) return
        if (e?.status === 404) setError('생성 문서를 찾을 수 없습니다.')
        else setError(e?.message || '생성 문서를 불러오지 못했습니다.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <section>
      <PageHeader
        title="생성 문서"
        description="생성된 초안 결과를 확인합니다."
        actions={<button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button>}
      />

      <InlineState cls={error ? 'error' : loading ? 'loading' : ''} message={error || (loading ? '생성 문서를 불러오는 중...' : '')} />

      {!loading && !error && doc && (
        <>
          <article className="panel">
            <h2>{doc.title || '제목 없는 생성 문서'}</h2>
            <div className="summary-grid compact">
              <div className="stat-card">
                <small>프롬프트</small>
                <strong style={{ whiteSpace: 'normal' }}>{doc.prompt || '-'}</strong>
              </div>
              <div className="stat-card">
                <small>참고 문서 수</small>
                <strong>{Array.isArray(doc.sourceDocumentIds) ? doc.sourceDocumentIds.length : 0}</strong>
              </div>
            </div>
          </article>

          <article className="panel" style={{ marginTop: 20 }}>
            <h2>참고 문서</h2>
            {Array.isArray(doc.sourceDocumentsPreview) && doc.sourceDocumentsPreview.length > 0 ? (
              <ul>
                {doc.sourceDocumentsPreview.map((source) => (
                  <li key={source.id}>
                    <strong>{source.title || source.id}</strong>
                    <span className="muted"> ({source.category || '기타'})</span>
                    <div><code>{source.id}</code></div>
                  </li>
                ))}
              </ul>
            ) : Array.isArray(doc.sourceDocumentIds) && doc.sourceDocumentIds.length > 0 ? (
              <ul>
                {doc.sourceDocumentIds.map((sourceId) => (
                  <li key={sourceId}><code>{sourceId}</code></li>
                ))}
              </ul>
            ) : (
              <p className="muted">참고 문서 정보가 없습니다.</p>
            )}
          </article>

          <article className="panel" style={{ marginTop: 20 }}>
            <h2>본문</h2>
            <div className="doc-fulltext-box">
              <pre>{doc.contentText || '본문 내용이 없습니다.'}</pre>
            </div>
          </article>
        </>
      )}
    </section>
  )
}
