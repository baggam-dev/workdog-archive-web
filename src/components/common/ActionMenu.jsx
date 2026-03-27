import { useEffect, useRef, useState } from 'react'

export default function ActionMenu({ onDetail, onDelete }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="action-menu" ref={rootRef}>
      <button className="icon-btn dots" type="button" aria-label="행 액션 열기" onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="19" r="1.8" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="action-menu-popover" role="menu">
          <button className="menu-item" type="button" onClick={() => { setOpen(false); onDetail?.() }}>상세 보기</button>
          <button className="menu-item danger" type="button" onClick={() => { setOpen(false); onDelete?.() }}>삭제</button>
        </div>
      )}
    </div>
  )
}
