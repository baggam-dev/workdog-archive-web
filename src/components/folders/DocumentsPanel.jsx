import FilterBar from '../common/FilterBar'
import DataTable from '../common/DataTable'
import InlineState from '../common/InlineState'

export default function DocumentsPanel({
  state,
  folderInfo,
  formatKST,
  formatKSTDateOnly,
  uploadForm,
  setUploadForm,
  onUpload,
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
  return (
    <article className="panel">
      <h2>문서</h2>
      <InlineState cls={state.cls} message={state.msg} />

      {folderInfo && <div className="meta-line">선택 폴더: <b>{folderInfo.name}</b> · 생성일: {formatKST(folderInfo.createdAt)}</div>}

      <div className="form-card">
        <b>문서 업로드</b>
        <input placeholder="문서 제목(선택)" value={uploadForm.title} onChange={(e) => setUploadForm((v) => ({ ...v, title: e.target.value }))} />
        <input type="file" accept=".hwp,.pdf,.xlsx,.xls,.txt" onChange={(e) => setUploadForm((v) => ({ ...v, file: e.target.files?.[0] || null }))} />
        <button className="btn" type="button" onClick={onUpload}>업로드</button>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        fileTypes={fileTypes}
        defaultFilter={defaultFilter}
      />

      <div className="actions" style={{ marginBottom: 8 }}>
        <button className="btn danger" type="button" disabled={checkedDocIds.length === 0} onClick={onBulkDelete}>선택 삭제 ({checkedDocIds.length})</button>
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
        rows={filteredDocs.map((d, idx) => (
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
            <td>
              <div className="actions table-actions">
                <button className="btn" type="button" onClick={() => onOpenDetail(d)}>상세</button>
                <button className="btn danger" type="button" onClick={() => onDeleteOne(d.id)}>삭제</button>
              </div>
            </td>
          </tr>
        ))}
      />

      <div className="mobile-only card-list">
        {filteredDocs.map((d) => (
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
        <div className="detail-box">
          <div className="title-row">
            <h2>문서 상세 · {activeDoc.title}</h2>
            <button className="btn" type="button" onClick={() => setActiveDoc(null)}>닫기</button>
          </div>
          <div className="meta">형식: {activeDoc.fileType} · 수정일: {formatKST(activeDoc.uploadedAt)}</div>
          <div className="meta">요약: {activeDoc.summaryOneLine || '-'}</div>
          <textarea value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder="메모를 입력하세요" rows={4} />
          <div className="actions right-actions">
            <button className="btn" type="button" onClick={onSaveMemo}>메모 저장</button>
          </div>
        </div>
      )}
    </article>
  )
}
