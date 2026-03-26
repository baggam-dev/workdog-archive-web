import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'
import FolderSidebar from '../components/folders/FolderSidebar'

function statusState(loading, error, length) {
  if (loading) return { cls: 'loading', msg: '데이터를 불러오는 중...' }
  if (error) return { cls: 'error', msg: `로드 실패: ${error}` }
  if (length === 0) return { cls: '', msg: '데이터가 없습니다.' }
  return { cls: '', msg: `총 ${length}건 표시 중` }
}

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
    return () => {
      mounted = false
    }
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
    return () => {
      mounted = false
    }
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

  return (
    <section>
      <PageHeader title="폴더 관리" description="폴더 생성/수정/삭제 전용 화면" />
      <Toast type={notice.type} message={notice.message} />

      <div className="grid2" style={{ gridTemplateColumns: '360px 1fr' }}>
        <FolderSidebar
          loading={loading}
          error={error}
          folders={folders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
          createForm={createForm}
          setCreateForm={setCreateForm}
          onCreateFolder={onCreateFolder}
          folderInfo={folderInfo}
          editForm={editForm}
          setEditForm={setEditForm}
          onStartEditFolder={onStartEditFolder}
          onSaveEditFolder={onSaveEditFolder}
          onDeleteFolder={onDeleteFolder}
          statusMessage={statusState(loading, error, folders.length).msg}
        />

        <article className="panel">
          <h2>안내</h2>
          <p className="muted">문서 작업은 좌측 메뉴의 "문서 관리" 화면에서 진행하세요.</p>
          {folderInfo ? (
            <div className="form-card" style={{ maxWidth: 520 }}>
              <b>선택 폴더 정보</b>
              <div>이름: {folderInfo.name}</div>
              <div>설명: {folderInfo.description || '-'}</div>
              <div>색상: <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: folderInfo.color || '#f59e0b', verticalAlign: 'middle' }} /></div>
            </div>
          ) : (
            <p className="muted">폴더를 선택해 주세요.</p>
          )}
        </article>
      </div>
    </section>
  )
}
