export default function UploadModal({ open, onClose, uploadForm, setUploadForm, onUpload, folderName }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="title-row">
          <h2>문서 업로드</h2>
          <button className="btn" type="button" onClick={onClose}>닫기</button>
        </div>
        <p className="muted">대상 폴더: {folderName || '선택 없음'}</p>

        <div className="form-card" style={{ marginBottom: 0 }}>
          <input
            placeholder="문서 제목(선택)"
            value={uploadForm.title}
            onChange={(e) => setUploadForm((v) => ({ ...v, title: e.target.value }))}
          />
          <input
            type="file"
            accept=".hwp,.pdf,.xlsx,.xls,.txt"
            onChange={(e) => setUploadForm((v) => ({ ...v, file: e.target.files?.[0] || null }))}
          />
          <div className="actions right-actions">
            <button className="btn primary" type="button" onClick={onUpload}>업로드 실행</button>
          </div>
        </div>
      </div>
    </div>
  )
}
