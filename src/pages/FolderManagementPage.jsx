import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'

export default function FolderManagementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState({ type: '', message: '' })

  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [folderInfo, setFolderInfo] = useState(null)

  const [createForm, setCreateForm] = useState({ name: '', description: '', color: '#f59e0b' })
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', color: '#f59e0b' })

  const normalizeError = (e, fallback = '요청 처리 중 오류가 발생했습니다.') => {
    const msg = String(e?.message || '').trim()
    if (!msg) return fallback
    if (msg.includes('Failed to fetch')) return '네트워크 연결 문제로 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    return msg
  }

  const showNotice = (message, type = 'info') => {
    setNotice({ type, message })
    setTimeout(() => setNotice({ type: '', message: '' }), 2600)
  }

  const refreshFolders = async () => {
    const fs = await apiClient.folders()
    setFolders(Array.isArray(fs) ? fs : [])
    const nextId = selectedFolderId && fs.some((f) => f.id === selectedFolderId) ? selectedFolderId : (fs[0]?.id || '')
    setSelectedFolderId(nextId)
    if (nextId) {
      const folder = await apiClient.folder(nextId)
      setFolderInfo(folder)
    } else {
      setFolderInfo(null)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        await refreshFolders()
      } catch (e) {
        if (!mounted) return
        const msg = normalizeError(e, '폴더 로드 실패')
        setError(msg)
        showNotice(msg, 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!selectedFolderId) return setFolderInfo(null)
      try {
        const folder = await apiClient.folder(selectedFolderId)
        if (mounted) setFolderInfo(folder)
      } catch {
        if (mounted) setFolderInfo(null)
      }
    })()
    return () => { mounted = false }
  }, [selectedFolderId])

  const onCreateFolder = async () => {
    if (!createForm.name.trim()) return showNotice('폴더명은 필수입니다.')
    try {
      await apiClient.createFolder(createForm)
      setCreateForm({ name: '', description: '', color: '#f59e0b' })
      await refreshFolders()
      showNotice('폴더가 생성되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onStartEditFolder = () => {
    if (!folderInfo) return
    setEditForm({
      id: folderInfo.id,
      name: folderInfo.name || '',
      description: folderInfo.description || '',
      color: folderInfo.color || '#f59e0b',
    })
  }

  const onSaveEditFolder = async () => {
    if (!editForm.id) return
    try {
      await apiClient.updateFolder(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        color: editForm.color,
      })
      await refreshFolders()
      showNotice('폴더가 수정되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onDeleteFolder = async () => {
    if (!folderInfo) return
    if (!window.confirm('선택 폴더를 삭제하시겠습니까?')) return
    try {
      await apiClient.deleteFolder(folderInfo.id)
      await refreshFolders()
      showNotice('폴더가 삭제되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const totalDocs = useMemo(
    () => folders.reduce((acc, f) => acc + Number(f.documentCount || 0), 0),
    [folders],
  )

  return (
    <section>
      <PageHeader
        title="폴더 관리"
        description="Figma 기준 폴더 운영 레이아웃"
        actions={<Link className="btn secondary" to="/archive/documents">문서관리로 이동</Link>}
      />
      <Toast type={notice.type} message={notice.message} />

      <div className="folder-manage-topstats">
        <article className="folder-stat-card">
          <p>전체 폴더</p>
          <strong>{folders.length}</strong>
        </article>
        <article className="folder-stat-card">
          <p>전체 문서</p>
          <strong>{totalDocs}</strong>
        </article>
        <article className="folder-stat-card">
          <p>선택 폴더</p>
          <strong>{folderInfo?.name || '-'}</strong>
        </article>
      </div>

      <div className="folder-manage-grid figma-style">
        <article className="panel folder-left-panel">
          <div className="title-row folder-section-head">
            <h2>📁 폴더 목록</h2>
            {loading && <span className="muted">불러오는 중...</span>}
          </div>
          {error && <p className="coming-alert">{error}</p>}

          <div className="folder-list modern">
            {folders.length === 0 ? (
              <div className="empty-state">생성된 폴더가 없습니다.</div>
            ) : folders.map((f) => (
              <button key={f.id} className={`folder-btn folder-modern-btn ${selectedFolderId === f.id ? 'active' : ''}`} onClick={() => setSelectedFolderId(f.id)} type="button">
                <span className="folder-modern-head">
                  <span className="folder-dot" style={{ backgroundColor: f.color || '#f59e0b' }} />
                  <b>{f.name}</b>
                  <small>{f.documentCount ?? 0}건</small>
                </span>
                <small>{f.description || '설명 없음'}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="panel folder-right-panel">
          <div className="folder-selected-summary">
            <span className="summary-label">현재 선택 폴더</span>
            <strong>{folderInfo?.name || '선택 없음'}</strong>
            <small>{folderInfo?.description || '왼쪽 목록에서 폴더를 선택하면 상세 편집이 가능합니다.'}</small>
          </div>

          <div className="folder-form-grid">
            <div className="form-card folder-form-card">
              <div className="title-row">
                <b>새 폴더 생성</b>
                <span className="muted">필수: 폴더명</span>
              </div>
              <input placeholder="폴더명" value={createForm.name} onChange={(e) => setCreateForm((v) => ({ ...v, name: e.target.value }))} />
              <input placeholder="설명" value={createForm.description} onChange={(e) => setCreateForm((v) => ({ ...v, description: e.target.value }))} />
              <div className="folder-color-row">
                <span className="muted">색상</span>
                <input type="color" value={createForm.color} onChange={(e) => setCreateForm((v) => ({ ...v, color: e.target.value }))} />
              </div>
              <button className="btn primary folder-submit-btn" type="button" onClick={onCreateFolder}>폴더 생성</button>
            </div>

            {folderInfo ? (
              <div className="form-card folder-form-card">
                <div className="title-row">
                  <b>선택 폴더 수정</b>
                  <button className="btn secondary btn-sm" type="button" onClick={onStartEditFolder}>정보 불러오기</button>
                </div>
                <input placeholder="폴더명" value={editForm.name} onChange={(e) => setEditForm((v) => ({ ...v, name: e.target.value }))} />
                <input placeholder="설명" value={editForm.description} onChange={(e) => setEditForm((v) => ({ ...v, description: e.target.value }))} />
                <div className="folder-color-row">
                  <span className="muted">색상</span>
                  <input type="color" value={editForm.color} onChange={(e) => setEditForm((v) => ({ ...v, color: e.target.value }))} />
                </div>
                <div className="actions folder-edit-actions">
                  <button className="btn secondary" type="button" onClick={onSaveEditFolder}>저장</button>
                  <button className="btn danger" type="button" onClick={onDeleteFolder}>삭제</button>
                </div>
              </div>
            ) : (
              <div className="empty-state">수정할 폴더를 왼쪽에서 선택해 주세요.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
