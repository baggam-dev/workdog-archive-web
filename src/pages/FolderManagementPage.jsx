import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'

const COLOR_PRESETS = ['#5B7FF3', '#8B5CF6', '#5FB3CF', '#5FB98A', '#E8A83C', '#E25B52', '#D45A9F', '#6B63E8']

function formatDateOnly(value) {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  } catch {
    return '-'
  }
}

export default function FolderManagementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState({ type: '', message: '' })

  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [folderInfo, setFolderInfo] = useState(null)
  const [mode, setMode] = useState('empty') // empty | detail | edit | create

  const [form, setForm] = useState({ id: '', name: '', description: '', color: '#5B7FF3' })

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
    const nextFolders = Array.isArray(fs) ? fs : []
    setFolders(nextFolders)

    if (!selectedFolderId) {
      setFolderInfo(null)
      setMode((prev) => (prev === 'create' ? 'create' : 'empty'))
      return
    }

    const stillExists = nextFolders.some((f) => f.id === selectedFolderId)
    if (!stillExists) {
      setSelectedFolderId('')
      setFolderInfo(null)
      setMode('empty')
      return
    }

    const folder = await apiClient.folder(selectedFolderId)
    setFolderInfo(folder)
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
      if (!selectedFolderId) {
        setFolderInfo(null)
        if (mode !== 'create') setMode('empty')
        return
      }
      try {
        const folder = await apiClient.folder(selectedFolderId)
        if (!mounted) return
        setFolderInfo(folder)
        if (mode !== 'edit') setMode('detail')
      } catch {
        if (!mounted) return
        setFolderInfo(null)
        if (mode !== 'create') setMode('empty')
      }
    })()
    return () => { mounted = false }
  }, [selectedFolderId])

  const onSelectFolder = (id) => {
    setSelectedFolderId(id)
    setMode('detail')
  }

  const onCloseRightPane = () => {
    setSelectedFolderId('')
    setFolderInfo(null)
    setForm({ id: '', name: '', description: '', color: '#5B7FF3' })
    setMode('empty')
  }

  const onStartCreate = () => {
    setSelectedFolderId('')
    setFolderInfo(null)
    setForm({ id: '', name: '', description: '', color: '#5B7FF3' })
    setMode('create')
  }

  const onStartEdit = () => {
    if (!folderInfo) return
    setForm({
      id: folderInfo.id,
      name: folderInfo.name || '',
      description: folderInfo.description || '',
      color: folderInfo.color || '#5B7FF3',
    })
    setMode('edit')
  }

  const onSaveCreate = async () => {
    if (!form.name.trim()) return showNotice('폴더 이름은 필수입니다.')
    try {
      const created = await apiClient.createFolder({
        name: form.name,
        description: form.description,
        color: form.color,
      })
      await refreshFolders()
      if (created?.id) setSelectedFolderId(created.id)
      setMode('detail')
      showNotice('폴더가 생성되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onSaveEdit = async () => {
    if (!form.id) return
    if (!form.name.trim()) return showNotice('폴더 이름은 필수입니다.')
    try {
      await apiClient.updateFolder(form.id, {
        name: form.name,
        description: form.description,
        color: form.color,
      })
      await refreshFolders()
      setMode('detail')
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
      setSelectedFolderId('')
      await refreshFolders()
      setMode('empty')
      showNotice('폴더가 삭제되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const folderCount = folders.length

  const selectedCount = useMemo(
    () => Number(folderInfo?.documentCount || folders.find((f) => f.id === selectedFolderId)?.documentCount || 0),
    [folderInfo, folders, selectedFolderId],
  )

  return (
    <section>
      <PageHeader
        title="폴더 관리"
        description="폴더 생성/수정/삭제 전용 화면"
        actions={<button className="btn primary" type="button" onClick={onStartCreate}>＋ 새 폴더</button>}
      />

      <Toast type={notice.type} message={notice.message} />
      {error && <p className="coming-alert">{error}</p>}

      <div className="folder-explorer-grid">
        <aside className="panel folder-nav-panel">
          <h2 className="folder-nav-title">📁 전체 폴더 ({folderCount})</h2>

          <div className="folder-list modern folder-nav-list">
            {loading && <p className="muted">불러오는 중...</p>}
            {!loading && folders.length === 0 ? (
              <div className="empty-state">생성된 폴더가 없습니다.</div>
            ) : folders.map((f) => (
              <button
                key={f.id}
                className={`folder-btn folder-nav-item ${selectedFolderId === f.id ? 'active' : ''}`}
                onClick={() => onSelectFolder(f.id)}
                type="button"
              >
                <div className="folder-nav-item-top">
                  <span className="folder-icon-badge" style={{ color: f.color || '#5B7FF3' }}>📁</span>
                  <b>{f.name}</b>
                  <small>{f.documentCount ?? 0}개</small>
                </div>
                <p>{f.description || '설명 없음'}</p>
                <span className="folder-created">생성일: {formatDateOnly(f.createdAt)}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="panel folder-detail-panel">
          {mode === 'empty' && (
            <div className="folder-empty-pane">
              <div className="folder-empty-icon">📁</div>
              <h3>폴더를 선택해주세요</h3>
              <p>좌측 목록에서 폴더를 선택하면 상세 정보를 확인할 수 있습니다</p>
            </div>
          )}

          {mode === 'detail' && folderInfo && (
            <div className="folder-detail-wrap">
              <div className="folder-detail-head">
                <div className="folder-detail-title">
                  <span className="folder-icon-badge large" style={{ color: folderInfo.color || '#5B7FF3' }}>📁</span>
                  <div>
                    <h3>{folderInfo.name}</h3>
                    <p>{folderInfo.description || '설명 없음'}</p>
                  </div>
                </div>
                <button className="folder-close-btn" type="button" onClick={onCloseRightPane}>×</button>
              </div>

              <div className="folder-detail-stats">
                <div className="folder-mini-stat">
                  <span>문서 수</span>
                  <strong>{selectedCount}개</strong>
                </div>
                <div className="folder-mini-stat">
                  <span>생성일</span>
                  <strong>{formatDateOnly(folderInfo.createdAt)}</strong>
                </div>
              </div>

              <div className="folder-setting-area">
                <h4>폴더 설정</h4>
                <button className="btn secondary folder-full-btn" type="button" onClick={onStartEdit}>✎ 폴더 수정</button>
                <button className="btn danger folder-full-btn soft" type="button" onClick={onDeleteFolder}>🗑 폴더 삭제</button>
                <div className="folder-warn-box">⚠ 이 폴더에는 {selectedCount}개의 문서가 있습니다. 삭제 시 모든 문서도 함께 삭제됩니다.</div>
              </div>
            </div>
          )}

          {(mode === 'edit' || mode === 'create') && (
            <div className="folder-edit-pane">
              <div className="folder-edit-head">
                <h3>{mode === 'create' ? '새 폴더' : '폴더 수정'}</h3>
                <button className="folder-close-btn" type="button" onClick={mode === 'create' ? onCloseRightPane : () => setMode('detail')}>×</button>
              </div>

              <label className="folder-field-label">폴더 이름 *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="폴더 이름을 입력하세요"
              />

              <label className="folder-field-label">설명</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="폴더 설명"
              />

              <label className="folder-field-label">폴더 색상</label>
              <div className="folder-color-presets">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-chip ${form.color === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                    aria-label={`색상 ${c}`}
                  >
                    {form.color === c ? '✓' : ''}
                  </button>
                ))}
              </div>

              <div className="folder-color-manual">
                <input type="color" value={form.color} onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))} />
                <span>또는 직접 색상 선택</span>
              </div>

              <div className="actions folder-edit-actions">
                <button className="btn primary folder-save-btn" type="button" onClick={mode === 'create' ? onSaveCreate : onSaveEdit}>✓ 저장</button>
                <button className="btn secondary" type="button" onClick={mode === 'create' ? onCloseRightPane : () => setMode('detail')}>취소</button>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
