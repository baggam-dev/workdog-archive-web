import { useEffect, useRef, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import useDocumentViewModel from '../hooks/useDocumentViewModel'
import FolderSidebar from '../components/folders/FolderSidebar'
import DocumentsPanel from '../components/folders/DocumentsPanel'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'

const defaultFilter = {
  title: '',
  category: '',
  fileType: '',
  tag: '',
  onlyImportant: false,
}

const categories = ['계획서', '결과보고', '안내문', '공문', '일정표', '회의자료', '참고자료', '기타']
const fileTypes = ['hwp', 'pdf', 'xlsx', 'xls', 'txt']

function formatKST(iso) {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

function formatKSTDateOnly(iso) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return iso
  }
}

function statusState(loading, error, length) {
  if (loading) return { cls: 'loading', msg: '데이터를 불러오는 중...' }
  if (error) return { cls: 'error', msg: `로드 실패: ${error}` }
  if (length === 0) return { cls: '', msg: '데이터가 없습니다.' }
  return { cls: '', msg: `총 ${length}건 표시 중` }
}

export default function FoldersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState({ type: '', message: '' })

  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [folderInfo, setFolderInfo] = useState(null)
  const [docs, setDocs] = useState([])
  const [filter, setFilter] = useState(defaultFilter)
  const [sort, setSort] = useState({ key: 'uploadedAt', dir: 'desc' })
  const [checkedDocIds, setCheckedDocIds] = useState([])

  const [createForm, setCreateForm] = useState({ name: '', description: '', color: '#f59e0b' })
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', color: '#f59e0b' })
  const [uploadForm, setUploadForm] = useState({ title: '', file: null })

  const [activeDoc, setActiveDoc] = useState(null)
  const [memoText, setMemoText] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  const rowRefs = useRef([])

  const refreshFolders = async () => {
    const fs = await apiClient.folders()
    setFolders(Array.isArray(fs) ? fs : [])
    if (!selectedFolderId && fs?.length) setSelectedFolderId(fs[0].id)
    if (selectedFolderId && !fs.some((f) => f.id === selectedFolderId)) setSelectedFolderId(fs[0]?.id || '')
  }

  const refreshDocs = async (folderId) => {
    if (!folderId) {
      setFolderInfo(null)
      setDocs([])
      return
    }
    const [folder, documents] = await Promise.all([apiClient.folder(folderId), apiClient.folderDocuments(folderId)])
    setFolderInfo(folder)
    setDocs(Array.isArray(documents) ? documents : [])
    setCheckedDocIds([])
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
      if (!selectedFolderId) {
        setFolderInfo(null)
        setDocs([])
        return
      }
      try {
        setLoading(true)
        setError('')
        await refreshDocs(selectedFolderId)
      } catch (e) {
        if (!mounted) return
        const msg = normalizeError(e, '문서 로드 실패')
        setError(msg)
        showNotice(msg, 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [selectedFolderId])

  const filteredDocs = useDocumentViewModel({ docs, filter, sort })
  const state = statusState(loading, error, filteredDocs.length)

  useEffect(() => {
    if (filteredDocs.length === 0) return setActiveRowIndex(0)
    setActiveRowIndex((idx) => Math.min(idx, filteredDocs.length - 1))
  }, [filteredDocs.length])

  const setSortKey = (key) => {
    const defaultDir = key === 'uploadedAt' ? 'desc' : 'asc'
    const opposite = defaultDir === 'asc' ? 'desc' : 'asc'
    if (sort.key !== key) return setSort({ key, dir: defaultDir })
    if (sort.dir === defaultDir) return setSort({ key, dir: opposite })
    return setSort({ key: 'uploadedAt', dir: 'desc' })
  }

  const sortMark = (key) => {
    if (sort.key !== key) return '↕'
    return sort.dir === 'asc' ? '▲' : '▼'
  }

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

  const moveFocusToRow = (nextIndex) => {
    setActiveRowIndex(nextIndex)
    const nextEl = rowRefs.current[nextIndex]
    if (nextEl) nextEl.focus()
  }

  const onCreateFolder = async () => {
    if (!createForm.name.trim()) return showNotice('폴더명은 필수입니다.')
    try {
      await apiClient.createFolder(createForm)
      await refreshFolders()
      setCreateForm({ name: '', description: '', color: '#f59e0b' })
      showNotice('폴더가 생성되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onStartEditFolder = () => {
    if (!folderInfo) return
    setEditForm({ id: folderInfo.id, name: folderInfo.name || '', description: folderInfo.description || '', color: folderInfo.color || '#f59e0b' })
  }

  const onSaveEditFolder = async () => {
    if (!editForm.id) return
    try {
      await apiClient.updateFolder(editForm.id, { name: editForm.name, description: editForm.description, color: editForm.color })
      await refreshFolders()
      await refreshDocs(editForm.id)
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
      setActiveDoc(null)
      setMemoText('')
      await refreshFolders()
      showNotice('폴더가 삭제되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onUpload = async () => {
    if (!selectedFolderId) return
    if (!uploadForm.file) return showNotice('업로드 파일을 선택해 주세요.')
    try {
      await apiClient.uploadDocument(selectedFolderId, uploadForm.title, uploadForm.file)
      setUploadForm({ title: '', file: null })
      await refreshDocs(selectedFolderId)
      showNotice('문서가 업로드되었습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onToggleImportant = async (doc) => {
    try {
      await apiClient.patchDocument(doc.id, { isImportant: !doc.isImportant })
      await refreshDocs(selectedFolderId)
      if (activeDoc?.id === doc.id) {
        const latest = (await apiClient.folderDocuments(selectedFolderId)).find((d) => d.id === doc.id)
        setActiveDoc(latest || null)
      }
      showNotice('중요 표시를 변경했습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onDeleteOne = async (docId) => {
    if (!selectedFolderId) return
    if (!window.confirm('문서를 삭제하시겠습니까?')) return
    try {
      await apiClient.deleteDocument(selectedFolderId, docId)
      if (activeDoc?.id === docId) {
        setActiveDoc(null)
        setMemoText('')
      }
      await refreshDocs(selectedFolderId)
      showNotice('문서를 삭제했습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onBulkDelete = async () => {
    if (!selectedFolderId || checkedDocIds.length === 0) return
    if (!window.confirm(`선택한 ${checkedDocIds.length}건을 삭제하시겠습니까?`)) return
    try {
      await apiClient.bulkDelete(selectedFolderId, checkedDocIds)
      await refreshDocs(selectedFolderId)
      setCheckedDocIds([])
      showNotice('선택 문서를 삭제했습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  const onOpenDetail = (doc) => {
    setActiveDoc(doc)
    setMemoText(doc.memo || '')
  }

  const onSaveMemo = async () => {
    if (!activeDoc) return
    try {
      await apiClient.patchDocument(activeDoc.id, { memo: memoText })
      const updated = await apiClient.document(activeDoc.id)
      setActiveDoc(updated)
      await refreshDocs(selectedFolderId)
      showNotice('메모를 저장했습니다.')
    } catch (e) {
      const msg = normalizeError(e)
      setError(msg)
      showNotice(msg, 'error')
    }
  }

  return (
    <section>
      <PageHeader title="폴더/문서 관리" description={`API Base: ${apiClient.baseUrl}`} />
      <Toast type={notice.type} message={notice.message} />

      <div className="grid2">
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

        <DocumentsPanel
          state={state}
          folderInfo={folderInfo}
          formatKST={formatKST}
          formatKSTDateOnly={formatKSTDateOnly}
          uploadForm={uploadForm}
          setUploadForm={setUploadForm}
          onUpload={onUpload}
          filter={filter}
          setFilter={setFilter}
          categories={categories}
          fileTypes={fileTypes}
          defaultFilter={defaultFilter}
          checkedDocIds={checkedDocIds}
          onBulkDelete={onBulkDelete}
          filteredDocs={filteredDocs}
          setCheckedDocIds={setCheckedDocIds}
          setSortKey={setSortKey}
          sortMark={sortMark}
          rowRefs={rowRefs}
          activeRowIndex={activeRowIndex}
          setActiveRowIndex={setActiveRowIndex}
          moveFocusToRow={moveFocusToRow}
          onOpenDetail={onOpenDetail}
          onToggleImportant={onToggleImportant}
          onDeleteOne={onDeleteOne}
          activeDoc={activeDoc}
          setActiveDoc={setActiveDoc}
          memoText={memoText}
          setMemoText={setMemoText}
          onSaveMemo={onSaveMemo}
        />
      </div>
    </section>
  )
}
