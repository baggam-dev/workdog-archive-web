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
      <div className={`state ${state.cls}`}>{state.msg}</div>

      {folderInfo && <div className="meta-line">선택 폴더: <b>{folderInfo.name}</b> · 생성일: {formatKST(folderInfo.createdAt)}</div>}

      <div className="form-card">
        <b>문서 업로드</b>
        <input placeholder="문서 제목(선택)" value={uploadForm.title} onChange={(e) => setUploadForm((v) => ({ ...v, title: e.target.value }))} />
        <input type="file" accept=".hwp,.pdf,.xlsx,.xls,.txt" onChange={(e) => setUploadForm((v) => ({ ...v, file: e.target.files?.[0] || null }))} />
        <button className="btn" type="button" onClick={onUpload}>업로드</button>
      </div>

      <div className="filters">
        <input placeholder="문서명 검색" value={filter.title} onChange={(e) => setFilter((v) => ({ ...v, title: e.target.value }))} />
        <select value={filter.category} onChange={(e) => setFilter((v) => ({ ...v, category: e.target.value }))}>
          <option value="">카테고리 전체</option>
          {categories.map((c) => <option value={c} key={c}>{c}</option>)}
        </select>
        <select value={filter.fileType} onChange={(e) => setFilter((v) => ({ ...v, fileType: e.target.value }))}>
          <option value="">형식 전체</option>
          {fileTypes.map((t) => <option value={t} key={t}>{t}</option>)}
        </select>
        <input placeholder="태그 검색" value={filter.tag} onChange={(e) => setFilter((v) => ({ ...v, tag: e.target.value }))} />
        <label className="mini-check-wrap">
          <input type="checkbox" checked={filter.onlyImportant} onChange={(e) => setFilter((v) => ({ ...v, onlyImportant: e.target.checked }))} /> 중요문서
        </label>
        <button className="btn" type="button" onClick={() => setFilter(defaultFilter)}>초기화</button>
      </div>

      <div className="actions" style={{ marginBottom: 8 }}>
        <button className="btn danger" type="button" disabled={checkedDocIds.length === 0} onClick={onBulkDelete}>선택 삭제 ({checkedDocIds.length})</button>
        <span className="kbd-help">키보드: ↑/↓, Home/End, Enter(상세), Space(중요)</span>
      </div>

      <div className="table-wrap desktop-only">
        <table className="doc-table">
          <colgroup>
            <col className="col-check" />
            <col className="col-important" />
            <col className="col-title" />
            <col className="col-type" />
            <col className="col-category" />
            <col className="col-date" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th><input type="checkbox" checked={filteredDocs.length > 0 && checkedDocIds.length === filteredDocs.length} onChange={(e) => {
                if (e.target.checked) setCheckedDocIds(filteredDocs.map((d) => d.id))
                else setCheckedDocIds([])
              }} /></th>
              <th><button className="th-btn" onClick={() => setSortKey('important')}>중요 {sortMark('important')}</button></th>
              <th><button className="th-btn" onClick={() => setSortKey('title')}>문서명 {sortMark('title')}</button></th>
              <th><button className="th-btn" onClick={() => setSortKey('fileType')}>형식 {sortMark('fileType')}</button></th>
              <th><button className="th-btn" onClick={() => setSortKey('category')}>카테고리 {sortMark('category')}</button></th>
              <th><button className="th-btn" onClick={() => setSortKey('uploadedAt')}>수정일 {sortMark('uploadedAt')}</button></th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((d, idx) => (
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
          </tbody>
        </table>
      </div>

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
