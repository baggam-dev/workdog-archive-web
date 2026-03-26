function InlineIcon({ type }) {
  const map = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    star: <><path d="m12 3 2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.3l6-.9z" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  }
  return (
    <span className="inline-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {map[type]}
      </svg>
    </span>
  )
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
        <InlineIcon type="search" />
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
          <InlineIcon type="star" /> 중요 문서만
        </label>

        <button className="btn ghost btn-sm" type="button" onClick={() => setFilter(defaultFilter)}>
          <InlineIcon type="close" /> 필터 초기화
        </button>
      </div>
    </div>
  )
}
