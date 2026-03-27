import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../common/FilterBar'
import DataTable from '../common/DataTable'
import InlineState from '../common/InlineState'
import SummaryStat from '../common/SummaryStat'
import EmptyState from '../common/EmptyState'
import ActionMenu from '../common/ActionMenu'

function pickFullText(doc) {
  return (
    doc?.fullText
    || doc?.content
    || doc?.body
    || doc?.text
    || doc?.extractedText
    || doc?.ocrText
    || ''
  )
}

export default function DocumentsPanel({
  state,
  folders,
  selectedFolderId,
  setSelectedFolderId,
  formatKST,
  formatKSTDateOnly,
  filter,
  setFilter,
  categories,
  fileTypes,
  defaultFilter,
  checkedDocIds,
  onBulkDelete,
  filteredDocs,
  setCheckedDocIds,
  setSortKey,
  sortMark,
  rowRefs,
  activeRowIndex,
  setActiveRowIndex,
  moveFocusToRow,
  onOpenDetail,
  onToggleImportant,
  onDeleteOne,
  activeDoc,
  setActiveDoc,
  memoText,
  setMemoText,
  onSaveMemo,
}) {
  const [fullOpen, setFullOpen] = useState(false)
  const fullText = useMemo(() => pickFullText(activeDoc), [activeDoc])

  useEffect(() => {
    setFullOpen(false)
  }, [activeDoc?.id])

  return (
    <article className="panel">
      <h2>문서</h2>
      <InlineState cls={state.cls} message={state.msg} />

      <div className="folder-selector-head">
        <div className="folder-pick-label"><span className="nav-item-icon" aria-hidden="true">📁</span> 폴더 선택</div>
        <Link className="btn secondary btn-sm" to="/archive/folders"><span className="nav-item-icon" aria-hidden="true">⚙</span> 폴더관리</Link>
      </div>

      <div className="folder-selector">
        <div className="folder-tabs">
          {folders.map((f) => (
            <button
              key={f.id}
              className={`folder-tab ${selectedFolderId === f.id ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedFolderId(f.id)}
            >
              <span className="nav-item-icon" aria-hidden="true">◫</span>
              <span>{f.name}</span>
              <span className="folder-count">{f.documentCount ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        fileTypes={fileTypes}
        defaultFilter={defaultFilter}
      />

      <div className="summary-grid compact">
        <SummaryStat label="표시 문서" value={filteredDocs.length} icon="docs" />
        <SummaryStat label="중요 문서" value={filteredDocs.filter((d) => d.isImportant).length} icon="important" />
        <SummaryStat label="선택 문서" value={checkedDocIds.length} icon="selected" />
      </div>

      <div className="actions" style={{ marginBottom: 8 }}>
        {checkedDocIds.length > 0 ? (
          <button className="btn danger" type="button" onClick={onBulkDelete}>선택 삭제 ({checkedDocIds.length})</button>
        ) : (
          <span className="kbd-help">선택된 문서 없음</span>
        )}
        <span className="kbd-help">키보드: ↑/↓, Home/End, Enter(상세), Space(중요)</span>
      </div>

      <DataTable
        checkedAll={filteredDocs.length > 0 && checkedDocIds.length === filteredDocs.length}
        onToggleAll={(e) => {
          if (e.target.checked) setCheckedDocIds(filteredDocs.map((d) => d.id))
          else setCheckedDocIds([])
        }}
        sortMark={sortMark}
        setSortKey={setSortKey}
        rows={filteredDocs.length === 0 ? (
          <tr>
            <td colSpan={7}>
              <EmptyState title="표시할 문서가 없습니다." description="필터 조건을 바꾸거나 새 문서를 업로드해 주세요." />
            </td>
          </tr>
        ) : filteredDocs.map((d, idx) => (
          <tr
            key={d.id}
            ref={(el) => (rowRefs.current[idx] = el)}
            tabIndex={0}
            className={idx === activeRowIndex ? 'row-active' : ''}
            aria-selected={idx === activeRowIndex ? 'true' : 'false'}
            onFocus={() => setActiveRowIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault(); moveFocusToRow(Math.min(filteredDocs.length - 1, idx + 1)); return
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault(); moveFocusToRow(Math.max(0, idx - 1)); return
              }
              if (e.key === 'Home') {
                e.preventDefault(); moveFocusToRow(0); return
              }
              if (e.key === 'End') {
                e.preventDefault(); moveFocusToRow(filteredDocs.length - 1); return
              }
              if (e.key === 'Enter') {
                e.preventDefault(); onOpenDetail(d); return
              }
              if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault(); onToggleImportant(d)
              }
            }}
          >
            <td><input type="checkbox" checked={checkedDocIds.includes(d.id)} onChange={(e) => {
              if (e.target.checked) setCheckedDocIds((v) => [...new Set([...v, d.id])])
              else setCheckedDocIds((v) => v.filter((id) => id !== d.id))
            }} /></td>
            <td><button className={`star-btn ${d.isImportant ? 'on' : ''}`} onClick={() => onToggleImportant(d)}>{d.isImportant ? '★' : '☆'}</button></td>
            <td className="ellipsis" title={d.fileName || d.title}>{d.title}</td>
            <td className="ellipsis" title={String(d.fileType || '').toUpperCase()}>{String(d.fileType || '').toUpperCase()}</td>
            <td className="ellipsis" title={d.category || '기타'}>{d.category || '기타'}</td>
            <td title={formatKST(d.uploadedAt)}>{formatKSTDateOnly(d.uploadedAt)}</td>
            <td className="action-cell">
              <ActionMenu onDetail={() => onOpenDetail(d)} onDelete={() => onDeleteOne(d.id)} />
            </td>
          </tr>
        ))}
      />

      <div className="mobile-only card-list">
        {filteredDocs.length === 0 ? (
          <EmptyState title="표시할 문서가 없습니다." description="필터 조건을 바꾸거나 새 문서를 업로드해 주세요." />
        ) : filteredDocs.map((d) => (
          <article className="doc-card" key={`m-${d.id}`}>
            <div className="doc-head">
              <label className="mini-check-wrap">
                <input
                  type="checkbox"
                  checked={checkedDocIds.includes(d.id)}
                  onChange={(e) => {
                    if (e.target.checked) setCheckedDocIds((v) => [...new Set([...v, d.id])])
                    else setCheckedDocIds((v) => v.filter((id) => id !== d.id))
                  }}
                />선택
              </label>
              <button className={`star-btn ${d.isImportant ? 'on' : ''}`} onClick={() => onToggleImportant(d)}>{d.isImportant ? '★' : '☆'}</button>
            </div>
            <h3>{d.title}</h3>
            <p className="meta">형식: {String(d.fileType || '').toUpperCase()} · 카테고리: {d.category || '기타'}</p>
            <p className="meta">수정일: {formatKST(d.uploadedAt)}</p>
            <div className="actions right-actions">
              <button className="btn" type="button" onClick={() => onOpenDetail(d)}>상세</button>
              <button className="btn danger" type="button" onClick={() => onDeleteOne(d.id)}>삭제</button>
            </div>
          </article>
        ))}
      </div>

      {activeDoc && (
        <div className="modal-backdrop" onClick={() => setActiveDoc(null)}>
          <div className="modal doc-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="title-row">
              <h2>문서 상세 · {activeDoc.title}</h2>
              <button className="btn" type="button" onClick={() => setActiveDoc(null)}>닫기</button>
            </div>
            <div className="meta">형식: {activeDoc.fileType} · 수정일: {formatKST(activeDoc.uploadedAt)}</div>
            <div className="meta">요약: {activeDoc.summaryOneLine || '-'}</div>

            <button className="btn secondary btn-sm" type="button" onClick={() => setFullOpen((v) => !v)}>
              {fullOpen ? '전체내용 접기' : '전체내용 보기'}
            </button>

            {fullOpen && (
              <article className="doc-fulltext-box">
                <pre>{fullText || '문서 전체내용이 아직 없습니다.'}</pre>
              </article>
            )}

            <textarea value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder="메모를 입력하세요" rows={4} />
            <div className="actions right-actions">
              <button className="btn" type="button" onClick={onSaveMemo}>메모 저장</button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
