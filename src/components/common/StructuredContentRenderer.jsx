export default function StructuredContentRenderer({ structuredContent, fallbackText = '' }) {
  const blocks = Array.isArray(structuredContent?.blocks) ? structuredContent.blocks : []

  if (!blocks.length) {
    return (
      <div className="doc-fulltext-box">
        <pre>{fallbackText || '표시할 구조화 내용이 없습니다.'}</pre>
      </div>
    )
  }

  return (
    <div className="structured-renderer">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : 'h3'
          return <Tag key={index} className="structured-heading">{block.text}</Tag>
        }

        if (block.type === 'table') {
          const rows = Array.isArray(block.rows) ? block.rows : []
          return (
            <div key={index} className="structured-table-wrap">
              <table className="structured-table">
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.type === 'image') {
          return (
            <div key={index} className="structured-image-placeholder">
              <strong>이미지</strong>
              <div>{block.caption || block.alt || '이미지 영역'}</div>
            </div>
          )
        }

        return <p key={index} className="structured-paragraph">{block.text}</p>
      })}
    </div>
  )
}
