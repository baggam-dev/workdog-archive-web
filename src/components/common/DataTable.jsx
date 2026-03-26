export default function DataTable({
  checkedAll,
  onToggleAll,
  sortMark,
  setSortKey,
  rows,
}) {
  return (
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
            <th><input type="checkbox" checked={checkedAll} onChange={onToggleAll} /></th>
            <th><button className="th-btn" onClick={() => setSortKey('important')}>중요 {sortMark('important')}</button></th>
            <th><button className="th-btn" onClick={() => setSortKey('title')}>문서명 {sortMark('title')}</button></th>
            <th><button className="th-btn" onClick={() => setSortKey('fileType')}>형식 {sortMark('fileType')}</button></th>
            <th><button className="th-btn" onClick={() => setSortKey('category')}>카테고리 {sortMark('category')}</button></th>
            <th><button className="th-btn" onClick={() => setSortKey('uploadedAt')}>수정일 {sortMark('uploadedAt')}</button></th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}
