import InlineState from '../common/InlineState'

export default function FolderSidebar({
  loading,
  error,
  folders,
  selectedFolderId,
  setSelectedFolderId,
  createForm,
  setCreateForm,
  onCreateFolder,
  folderInfo,
  editForm,
  setEditForm,
  onStartEditFolder,
  onSaveEditFolder,
  onDeleteFolder,
  statusMessage,
}) {
  return (
    <article className="panel">
      <h2>폴더</h2>
      <InlineState cls={loading ? 'loading' : error ? 'error' : ''} message={statusMessage} />

      <div className="form-card">
        <b>폴더 생성</b>
        <input placeholder="폴더명" value={createForm.name} onChange={(e) => setCreateForm((v) => ({ ...v, name: e.target.value }))} />
        <input placeholder="설명" value={createForm.description} onChange={(e) => setCreateForm((v) => ({ ...v, description: e.target.value }))} />
        <input type="color" value={createForm.color} onChange={(e) => setCreateForm((v) => ({ ...v, color: e.target.value }))} />
        <button className="btn" type="button" onClick={onCreateFolder}>생성</button>
      </div>

      <div className="folder-list">
        {folders.map((f) => (
          <button key={f.id} className={`folder-btn ${selectedFolderId === f.id ? 'active' : ''}`} onClick={() => setSelectedFolderId(f.id)} type="button">
            <span>{f.name}</span>
            <small>{f.description || '-'}</small>
          </button>
        ))}
      </div>

      {folderInfo && (
        <div className="form-card">
          <b>선택 폴더 수정</b>
          <div className="actions">
            <button className="btn" type="button" onClick={onStartEditFolder}>불러오기</button>
            <button className="btn" type="button" onClick={onSaveEditFolder}>저장</button>
            <button className="btn danger" type="button" onClick={onDeleteFolder}>삭제</button>
          </div>
          <input placeholder="폴더명" value={editForm.name} onChange={(e) => setEditForm((v) => ({ ...v, name: e.target.value }))} />
          <input placeholder="설명" value={editForm.description} onChange={(e) => setEditForm((v) => ({ ...v, description: e.target.value }))} />
          <input type="color" value={editForm.color} onChange={(e) => setEditForm((v) => ({ ...v, color: e.target.value }))} />
        </div>
      )}
    </article>
  )
}
