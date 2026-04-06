import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import InlineState from '../components/common/InlineState'
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

export default function GeneratedDocumentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [allDocs, setAllDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
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
        const [data, list] = await Promise.all([
          apiClient.generatedDocument(id),
          apiClient.generatedDocuments(),
        ])
        if (!mounted) return
        setDoc(data)
        setAllDocs(Array.isArray(list) ? list : [])
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

  const parentDoc = allDocs.find((item) => item.id === doc?.regeneratedFromId)
  const childDocs = allDocs.filter((item) => item.regeneratedFromId === doc?.id)

  const onSave = async () => {
    if (!doc?.id || saving || regenerating) return

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

  const onRegenerate = async () => {
    if (!doc?.id || regenerating || saving) return

    try {
      setRegenerating(true)
      setError('')
      setNotice('같은 참고 문서로 초안을 다시 생성하고 있습니다...')
      const regenerated = await apiClient.regenerateGeneratedDocument(doc.id, {
        prompt: editPrompt,
      })
      navigate(`/archive/generated/${regenerated.id}`)
    } catch (e) {
      setError(e?.message || '재생성에 실패했습니다.')
      setNotice('')
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="6-13 완료 · 생성문서 이력 정리"
        description="생성된 초안 결과를 확인, 수정 저장, 재생성하고 파생 이력을 추적할 수 있습니다. 다음 작업은 6-14 원본-생성 연결 강화입니다."
        actions={<div className="actions"><button className="btn secondary" type="button" onClick={() => navigate('/archive/generated')}>생성 문서 목록</button><button className="btn secondary" type="button" onClick={() => navigate('/archive/documents')}>문서 목록으로</button></div>}
      />

      <InlineState cls={error ? 'error' : (loading || saving || regenerating) ? 'loading' : ''} message={error || notice || (loading ? '생성 문서를 불러오는 중...' : '')} />

      {!loading && !error && doc && (
        <>
          <article className="panel">
            <h2>기본 정보</h2>
            <div className="form-card" style={{ marginBottom: 0 }}>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="제목" disabled={saving || regenerating} />
              <textarea rows={3} value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder="프롬프트" disabled={saving || regenerating} />
              <div className="summary-grid compact">
                <div className="stat-card">
                  <small>참고 문서 수</small>
                  <strong>{Array.isArray(doc.sourceDocumentIds) ? doc.sourceDocumentIds.length : 0}</strong>
                </div>
                <div className="stat-card">
                  <small>생성일</small>
                  <strong style={{ whiteSpace: 'normal' }}>{formatKST(doc.createdAt)}</strong>
                </div>
                <div className="stat-card">
                  <small>마지막 수정</small>
                  <strong style={{ whiteSpace: 'normal' }}>{formatKST(doc.updatedAt || doc.createdAt)}</strong>
                </div>
                <div className="stat-card">
                  <small>재생성 원본</small>
                  <strong style={{ whiteSpace: 'normal' }}>{doc.regeneratedFromId || '-'}</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="panel" style={{ marginTop: 20 }}>
            <h2>생성 이력</h2>
            <div className="summary-grid compact">
              <div className="stat-card">
                <small>부모 문서</small>
                {parentDoc ? (
                  <button className="btn secondary btn-sm" type="button" onClick={() => navigate(`/archive/generated/${parentDoc.id}`)}>{parentDoc.title || parentDoc.id}</button>
                ) : (
                  <strong>-</strong>
                )}
              </div>
              <div className="stat-card">
                <small>파생 문서 수</small>
                <strong>{childDocs.length}</strong>
              </div>
            </div>
            {childDocs.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p className="muted">이 문서에서 다시 생성된 문서</p>
                <ul>
                  {childDocs.map((child) => (
                    <li key={child.id}>
                      <button className="btn secondary btn-sm" type="button" onClick={() => navigate(`/archive/generated/${child.id}`)}>{child.title || child.id}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <article className="panel" style={{ marginTop: 20 }}>
            <h2>참고 문서</h2>
            {Array.isArray(doc.sourceDocumentsPreview) && doc.sourceDocumentsPreview.length > 0 ? (
              <ul>
                {doc.sourceDocumentsPreview.map((source) => (
                  <li key={source.id}>
                    <div className="title-row">
                      <div>
                        <strong>{source.title || source.id}</strong>
                        <span className="muted"> ({source.category || '기타'})</span>
                        <div><code>{source.id}</code></div>
                      </div>
                      <button className="btn secondary btn-sm" type="button" onClick={() => navigate('/archive/documents')}>원본 문서 보기</button>
                    </div>
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
              <textarea rows={18} value={editContentText} onChange={(e) => setEditContentText(e.target.value)} placeholder="본문 내용" disabled={saving || regenerating} />
              <div className="actions right-actions">
                <button className="btn secondary" type="button" onClick={onRegenerate} disabled={saving || regenerating}>{regenerating ? '재생성 중...' : '이 프롬프트로 다시 생성'}</button>
                <button className="btn primary" type="button" onClick={onSave} disabled={saving || regenerating}>{saving ? '저장 중...' : '수정 저장'}</button>
              </div>
            </div>
          </article>
        </>
      )}
    </section>
  )
}
