export default function FilterBar({
  filter,
  setFilter,
  categories,
  fileTypes,
  defaultFilter,
}) {
  return (
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
  )
}
