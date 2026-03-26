import { useMemo } from 'react'

export default function useDocumentViewModel({ docs, filter, sort }) {
  return useMemo(() => {
    const qTitle = filter.title.trim().toLowerCase()
    const qCategory = filter.category.trim().toLowerCase()
    const qType = filter.fileType.trim().toLowerCase()
    const qTag = filter.tag.trim().toLowerCase()

    const list = docs.filter((d) => {
      const okTitle = !qTitle || String(d.title || '').toLowerCase().includes(qTitle)
      const okCategory = !qCategory || String(d.category || '').toLowerCase() === qCategory
      const okType = !qType || String(d.fileType || '').toLowerCase() === qType
      const okTag = !qTag || (d.tags || []).some((t) => String(t).toLowerCase().includes(qTag))
      const okImportant = !filter.onlyImportant || !!d.isImportant
      return okTitle && okCategory && okType && okTag && okImportant
    })

    const dir = sort.dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      if (sort.key === 'important') return ((a.isImportant ? 1 : 0) - (b.isImportant ? 1 : 0)) * dir
      if (sort.key === 'title') return String(a.title || '').localeCompare(String(b.title || ''), 'ko') * dir
      if (sort.key === 'fileType') return String(a.fileType || '').localeCompare(String(b.fileType || ''), 'ko') * dir
      if (sort.key === 'category') return String(a.category || '').localeCompare(String(b.category || ''), 'ko') * dir
      return (new Date(a.uploadedAt) - new Date(b.uploadedAt)) * dir
    })

    return list
  }, [docs, filter, sort])
}
