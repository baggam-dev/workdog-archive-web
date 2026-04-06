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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editPrompt, setEditPrompt] = useState('')
  const [editContentText, setEditContentText] = useState('')

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
        setEditTitle(data?.title || '')
        setEditPrompt(data?.prompt || '')
        setEditContentText(data?.contentText || '')
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

  const onSave = async () => {
    if (!doc?.id || saving) return

    try {
      setSaving(true)
      setError('')
      setNotice('수정 내용을 저장하고 있습니다...')
      const updated = await apiClient.patchGeneratedDocument(doc.id, {
        title: editTitle,
        prompt: editPrompt,
        contentText: editContentText,
      })
      setDoc(updated)
      setEditTitle(updated?.title || '')
      setEditPrompt(updated?.prompt || '')
      setEditContentText(updated?.contentText || '')
      setNotice('저장했습니다.')
    } catch (e) {
      setError(e?.message || '생성 문서 저장에 실패했습니다.')
      setNotice('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="6-2 완료 · 생성 문서 수정"
        description="생성된 초안 결과를 확인하고 수정 저장할 수 있습니다. 다음 작업은 6-3 프롬프트 템플릿입니다."
        actions={<div className="actions"><button className="btn secondary" type="button" onClick={() => navigate('/archive/generated')}>생성 문서 목록</button><button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button></div>}
      />

      <InlineState cls={error ? 'error' : (loading || saving) ? 'loading' : ''} message={error || notice || (loading ? '생성 문서를 불러오는 중...' : '')} />

      {!loading && !error && doc && (
        <>
          <article className="panel">
            <h2>기본 정보</h2>
            <div className="form-card" style={{ marginBottom: 0 }}>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="제목" disabled={saving} />
              <textarea rows={3} value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder="프롬프트" disabled={saving} />
              <div className="summary-grid compact">
                <div className="stat-card">
                  <small>참고 문서 수</small>
                  <strong>{Array.isArray(doc.sourceDocumentIds) ? doc.sourceDocumentIds.length : 0}</strong>
                </div>
                <div className="stat-card">
                  <small>마지막 수정</small>
                  <strong style={{ whiteSpace: 'normal' }}>{doc.updatedAt || '-'}</strong>
                </div>
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
            <div className="form-card" style={{ marginBottom: 0 }}>
              <textarea rows={18} value={editContentText} onChange={(e) => setEditContentText(e.target.value)} placeholder="본문 내용" disabled={saving} />
              <div className="actions right-actions">
                <button className="btn primary" type="button" onClick={onSave} disabled={saving}>{{true: '저장 중...', false: '수정 저장'}[saving]}</button>
              </div>
            </div>
          </article>
        </>
      )}
    </section>
  )
}
