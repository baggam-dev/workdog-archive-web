import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import useDocumentViewModel from '../hooks/useDocumentViewModel'
import DocumentsPanel from '../components/folders/DocumentsPanel'
import PageHeader from '../components/common/PageHeader'
import Toast from '../components/common/Toast'
import UploadModal from '../components/common/UploadModal'

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
  if (length === 0) return { cls: '', msg: '' }
  return { cls: '', msg: '' }
}

export default function FoldersPage() {
  const navigate = useNavigate()
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

  const [uploadForm, setUploadForm] = useState({ title: '', file: null })
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false)

  const [activeDoc, setActiveDoc] = useState(null)
  const [memoText, setMemoText] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  const rowRefs = useRef([])

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
    const base = Array.isArray(fs) ? fs : []
    const withCounts = await Promise.all(base.map(async (f) => {
      try {
        const list = await apiClient.folderDocuments(f.id)
        return { ...f, documentCount: Array.isArray(list) ? list.length : Number(f.documentCount || 0) }
      } catch {
        return { ...f, documentCount: Number(f.documentCount || 0) }
      }
    }))
    setFolders(withCounts)
    if (!selectedFolderId && withCounts?.length) setSelectedFolderId(withCounts[0].id)
    if (selectedFolderId && !withCounts.some((f) => f.id === selectedFolderId)) setSelectedFolderId(withCounts[0]?.id || '')
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

  const moveFocusToRow = (nextIndex) => {
    setActiveRowIndex(nextIndex)
    const nextEl = rowRefs.current[nextIndex]
    if (nextEl) nextEl.focus()
  }

  const onUpload = async () => {
    if (!selectedFolderId) return
    if (!uploadForm.file) return showNotice('업로드 파일을 선택해 주세요.')
    try {
      await apiClient.uploadDocument(selectedFolderId, uploadForm.title, uploadForm.file)
      setUploadForm({ title: '', file: null })
      setUploadPanelOpen(false)
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

  const onGenerateSelected = () => {
    if (checkedDocIds.length === 0) return
    navigate('/archive/generate', { state: { documentIds: checkedDocIds } })
  }

  const onOpenDetail = async (doc) => {
    try {
      const detail = await apiClient.document(doc.id)
      setActiveDoc(detail || doc)
      setMemoText((detail || doc).memo || '')
    } catch {
      setActiveDoc(doc)
      setMemoText(doc.memo || '')
    }
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
      <PageHeader
        title="문서 관리"
        description="문서 목록 중심 작업 화면"
        actions={<button className="btn primary" type="button" disabled={!selectedFolderId} onClick={() => setUploadPanelOpen((v) => !v)}>+ 업로드</button>}
      />
      <Toast type={notice.type} message={notice.message} />

      <DocumentsPanel
        state={state}
        folderInfo={folderInfo}
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        formatKST={formatKST}
        formatKSTDateOnly={formatKSTDateOnly}
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        fileTypes={fileTypes}
        defaultFilter={defaultFilter}
        checkedDocIds={checkedDocIds}
        onBulkDelete={onBulkDelete}
        onGenerateSelected={onGenerateSelected}
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

      <UploadModal
        open={uploadPanelOpen}
        onClose={() => setUploadPanelOpen(false)}
        uploadForm={uploadForm}
        setUploadForm={setUploadForm}
        onUpload={onUpload}
        folderName={folderInfo?.name}
      />
    </section>
  )
}
