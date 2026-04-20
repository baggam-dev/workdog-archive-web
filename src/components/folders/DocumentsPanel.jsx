import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FilterBar from '../common/FilterBar'
import DataTable from '../common/DataTable'
import InlineState from '../common/InlineState'
import SummaryStat from '../common/SummaryStat'
import EmptyState from '../common/EmptyState'
import ActionMenu from '../common/ActionMenu'
import StructuredContentRenderer from '../common/StructuredContentRenderer'

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

function blockTypeLabel(type) {
  if (type === 'heading') return '제목'
  if (type === 'table' || type === 'table-placeholder') return '표'
  if (type === 'image' || type === 'image-placeholder') return '그림'
  return '문단'
}

function stripHtmlLike(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractStatusLabel(status) {
  if (status === 'success') return '정상 추출'
  if (status === 'failed') return '추출 실패'
  if (status === 'pending') return '처리 중'
  return '미확인'
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
  onGenerateSelected,
  filteredDocs,
  setCheckedDocIds,
  setSortKey,
  sortMark,
  rowRefs,
  activeRowIndex,
  setActiveRowIndex,
  moveFocusToRow,
  onOpenDetail,
  onViewGenerated,
  onToggleImportant,
  onDeleteOne,
  activeDoc,
  setActiveDoc,
  memoText,
  setMemoText,
  linkedGeneratedDocs,
  onSaveMemo,
}) {
  const navigate = useNavigate()
  const [fullOpen, setFullOpen] = useState(false)
  const [structureOpen, setStructureOpen] = useState(false)
  const fullText = useMemo(() => pickFullText(activeDoc), [activeDoc])
  const structuredBlocks = Array.isArray(activeDoc?.structuredContent?.blocks) ? activeDoc.structuredContent.blocks : []

  useEffect(() => {
    setFullOpen(false)
    setStructureOpen(false)
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

      <div className="document-toolbar-shell">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          categories={categories}
          fileTypes={fileTypes}
          defaultFilter={defaultFilter}
        />

        <div className="document-toolbar-meta">
          <div className="document-toolbar-copy">
            <strong>문서 탐색</strong>
            <span>검색, 필터, 상태 확인, 초안 생성까지 한 번에 처리합니다.</span>
          </div>
          <div className="actions document-toolbar-actions">
            <button className="btn primary" type="button" onClick={onGenerateSelected} disabled={checkedDocIds.length === 0}>선택 문서로 초안 만들기</button>
            {checkedDocIds.length > 0 ? (
              <button className="btn danger" type="button" onClick={onBulkDelete}>선택 삭제 ({checkedDocIds.length})</button>
            ) : (
              <span className="kbd-help">선택된 문서 없음</span>
            )}
          </div>
        </div>
      </div>

      <div className="summary-grid compact">
        <SummaryStat label="표시 문서" value={filteredDocs.length} icon="docs" />
        <SummaryStat label="중요 문서" value={filteredDocs.filter((d) => d.isImportant).length} icon="important" />
        <SummaryStat label="선택 문서" value={checkedDocIds.length} icon="selected" />
      </div>

      <div className="actions document-table-caption" style={{ marginBottom: 8 }}>
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
            <td colSpan={8}>
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
            <td className="doc-title-cell">
              <div className="doc-title-main" title={d.fileName || d.title}>{d.title}</div>
              <div className="doc-title-sub">
                <span className={`doc-status-badge ${d.extractStatus || 'unknown'}`}>{extractStatusLabel(d.extractStatus)}</span>
                {d.summaryOneLine ? <span className="doc-summary-snippet" title={stripHtmlLike(d.summaryOneLine)}>{stripHtmlLike(d.summaryOneLine)}</span> : null}
              </div>
            </td>
            <td className="ellipsis" title={String(d.fileType || '').toUpperCase()}><span className="doc-chip">{String(d.fileType || '').toUpperCase()}</span></td>
            <td className="ellipsis" title={d.category || '기타'}><span className="doc-chip subtle">{d.category || '기타'}</span></td>
            <td title={`관련 초안 ${d.generatedCount || 0}개`}><span className="doc-generated-count">{d.generatedCount || 0}개</span></td>
            <td title={formatKST(d.uploadedAt)}>
              <div className="doc-date-main">{formatKSTDateOnly(d.uploadedAt)}</div>
              <div className="doc-date-sub">업로드</div>
            </td>
            <td className="action-cell">
              <ActionMenu onDetail={() => onOpenDetail(d)} onViewGenerated={() => onViewGenerated(d)} onDelete={() => onDeleteOne(d.id)} />
            </td>
          </tr>
        ))}
      />

      {activeDoc && (
        <div className="modal-backdrop" onClick={() => setActiveDoc(null)}>
          <div className="modal doc-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-hero">
              <div className="doc-modal-head">
                <div>
                  <span className="generated-eyebrow">Source document</span>
                  <h2>원본 문서 상세 · {activeDoc.title}</h2>
                  <p className="meta">형식: {activeDoc.fileType} · 수정일: {formatKST(activeDoc.uploadedAt)}</p>
                </div>
                <div className="actions">
                  <button className="btn primary" type="button" onClick={() => navigate('/archive/generate', { state: { documentIds: [activeDoc.id] } })}>이 문서로 바로 초안 만들기</button>
                  <button className="btn" type="button" onClick={() => setActiveDoc(null)}>닫기</button>
                </div>
              </div>

              <div className="doc-meta-grid">
                <div className="doc-meta-card">
                  <span className="doc-meta-label">추출 방식</span>
                  <strong>{activeDoc.extractMethod || '-'}</strong>
                </div>
                <div className="doc-meta-card">
                  <span className="doc-meta-label">추출 상태</span>
                  <strong>{activeDoc.extractStatus || '-'}</strong>
                </div>
                <div className="doc-meta-card">
                  <span className="doc-meta-label">카테고리</span>
                  <strong>{activeDoc.category || '기타'}</strong>
                </div>
                <div className="doc-meta-card doc-meta-card-wide">
                  <span className="doc-meta-label">한 줄 요약</span>
                  <strong>{stripHtmlLike(activeDoc.summaryOneLine) || '-'}</strong>
                </div>
              </div>
            </div>

            <div className="doc-review-grid">
              <section className="doc-modal-section">
                <div className="title-row">
                  <h3>구조화 미리보기</h3>
                  <button className="btn secondary btn-sm" type="button" onClick={() => setStructureOpen((v) => !v)}>
                    {structureOpen ? '접기' : `전체보기 (${structuredBlocks.length})`}
                  </button>
                </div>
                <p className="muted">제목, 문단, 표, 이미지 등 추출된 구조를 먼저 검토합니다.</p>
                <StructuredContentRenderer structuredContent={activeDoc?.structuredContent} fallbackText={fullText} />
                {structureOpen && structuredBlocks.length > 0 ? (
                  <div className="doc-fulltext-box" style={{ marginTop: 12 }}>
                    <ul>
                      {structuredBlocks.map((block, index) => (
                        <li key={`${block.type}-${index}`} style={{ marginBottom: 8 }}>
                          <strong>[{blockTypeLabel(block.type)}]</strong>
                          <div>{block.text || (Array.isArray(block.rows) ? `${block.rows.length}행 표` : block.caption || '-')}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              <section className="doc-modal-section">
                <div className="title-row">
                  <h3>추출 원문</h3>
                  <button className="btn secondary btn-sm" type="button" onClick={() => setFullOpen((v) => !v)}>
                    {fullOpen ? '접기' : '전체보기'}
                  </button>
                </div>
                <p className="muted">원문 텍스트를 펼쳐 보면서 누락이나 깨짐 여부를 확인합니다.</p>
                {fullOpen ? (
                  <article className="doc-fulltext-box">
                    <pre>{fullText || '추출 원문이 아직 없습니다.'}</pre>
                  </article>
                ) : (
                  <div className="doc-collapsed-hint">원문은 필요할 때만 펼쳐서 보는 방식으로 정리했습니다.</div>
                )}
              </section>
            </div>

            <section className="doc-modal-section">
              <h3>연결된 생성문서</h3>
              {Array.isArray(linkedGeneratedDocs) && linkedGeneratedDocs.length > 0 ? (
                <ul>
                  {linkedGeneratedDocs.map((item) => (
                    <li key={item.id}>
                      <div className="title-row">
                        <div>
                          <strong>{item.title || item.id}</strong>
                          <div className="muted">{item.prompt || '-'}</div>
                        </div>
                        <button className="btn secondary btn-sm" type="button" onClick={() => navigate(`/archive/generated/${item.id}`)}>생성문서 보기</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">이 문서를 참고한 생성문서가 아직 없습니다.</p>
              )}
            </section>

            <section className="doc-modal-section">
              <h3>메모</h3>
              <textarea value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder="메모를 입력하세요" rows={5} />
              <div className="actions right-actions">
                <button className="btn" type="button" onClick={onSaveMemo}>메모 저장</button>
              </div>
            </section>
          </div>
        </div>
      )}
    </article>
  )
}
