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
      <button className="icon-btn dots" type="button" aria-label="행 액션 열기" onClick={() => setOpen((v) => !v)}>⋮</button>
      {open && (
        <div className="action-menu-popover" role="menu">
          <button className="menu-item" type="button" onClick={() => { setOpen(false); onDetail?.() }}>상세 보기</button>
          <button className="menu-item danger" type="button" onClick={() => { setOpen(false); onDelete?.() }}>삭제</button>
        </div>
      )}
    </div>
  )
}
