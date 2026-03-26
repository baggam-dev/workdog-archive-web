export default function ActionMenu({ onDetail, onDelete }) {
  return (
    <div className="actions table-actions">
      <button className="btn" type="button" onClick={onDetail}>상세</button>
      <button className="btn danger" type="button" onClick={onDelete}>삭제</button>
    </div>
  )
}
