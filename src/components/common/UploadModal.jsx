export default function UploadModal({ open, onClose, uploadForm, setUploadForm, onUpload, folderName, uploadState, onOpenLatest }) {
  if (!open) return null

  const fileName = uploadForm.file?.name || ''

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="title-row">
          <h2>문서 업로드</h2>
          <button className="btn" type="button" onClick={onClose}>닫기</button>
        </div>
        <p className="muted">대상 폴더: {folderName || '선택 없음'}</p>

        <div className="upload-dropzone">
          <strong>문서를 이곳에 올리거나 파일을 선택하세요</strong>
          <span>지원 형식: HWP, PDF, XLSX, XLS, TXT</span>
          <input
            type="file"
            accept=".hwp,.pdf,.xlsx,.xls,.txt"
            onChange={(e) => setUploadForm((v) => ({ ...v, file: e.target.files?.[0] || null }))}
          />
          {fileName ? <div className="upload-file-chip">선택 파일: {fileName}</div> : null}
        </div>

        <div className="form-card" style={{ marginBottom: 0 }}>
          <input
            placeholder="문서 제목(선택)"
            value={uploadForm.title}
            onChange={(e) => setUploadForm((v) => ({ ...v, title: e.target.value }))}
          />

          {uploadState?.phase !== 'idle' ? (
            <div className={`upload-status-card ${uploadState.phase}`}>
              <strong>
                {uploadState.phase === 'uploading' && '업로드 중'}
                {uploadState.phase === 'processing' && '처리 중'}
                {uploadState.phase === 'done' && '완료'}
                {uploadState.phase === 'error' && '실패'}
              </strong>
              <p>{uploadState.message}</p>
            </div>
          ) : null}

          <div className="actions right-actions">
            {uploadState?.phase === 'done' ? (
              <button className="btn secondary" type="button" onClick={onOpenLatest}>목록으로 돌아가기</button>
            ) : null}
            <button className="btn primary" type="button" onClick={onUpload} disabled={uploadState?.phase === 'uploading' || uploadState?.phase === 'processing'}>
              {uploadState?.phase === 'uploading' || uploadState?.phase === 'processing' ? '처리 중...' : '업로드 실행'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
