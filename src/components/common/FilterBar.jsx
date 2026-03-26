function SearchIcon() {
  return <span aria-hidden="true">⌕</span>
}

function StarIcon() {
  return <span aria-hidden="true">★</span>
}

function XIcon() {
  return <span aria-hidden="true">✕</span>
}

export default function FilterBar({
  filter,
  setFilter,
  categories,
  fileTypes,
  defaultFilter,
}) {
  return (
    <div className="filter-container">
      <div className="filter-search">
        <SearchIcon />
        <input
          placeholder="문서 제목 검색..."
          value={filter.title}
          onChange={(e) => setFilter((v) => ({ ...v, title: e.target.value }))}
        />
      </div>

      <div className="filter-options">
        <select value={filter.category} onChange={(e) => setFilter((v) => ({ ...v, category: e.target.value }))}>
          <option value="">카테고리 전체</option>
          {categories.map((c) => <option value={c} key={c}>{c}</option>)}
        </select>

        <select value={filter.fileType} onChange={(e) => setFilter((v) => ({ ...v, fileType: e.target.value }))}>
          <option value="">파일 형식 전체</option>
          {fileTypes.map((t) => <option value={t} key={t}>{t}</option>)}
        </select>

        <label className="filter-checkbox">
          <input type="checkbox" checked={filter.onlyImportant} onChange={(e) => setFilter((v) => ({ ...v, onlyImportant: e.target.checked }))} />
          <StarIcon /> 중요 문서만
        </label>

        <button className="btn ghost" type="button" onClick={() => setFilter(defaultFilter)}>
          <XIcon /> 필터 초기화
        </button>
      </div>
    </div>
  )
}
