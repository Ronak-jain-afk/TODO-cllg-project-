import { useRef } from 'react'
import { useTodoStore } from '../../store/todoStore'

export function ImportExport() {
  const items = useTodoStore(s => s.items)
  const replaceItems = useTodoStore(s => s.replaceItems)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = JSON.stringify(items, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flowforge-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!Array.isArray(parsed) || !parsed[0]?.id || !parsed[0]?.title) {
          alert('Invalid file format.')
          return
        }
        replaceItems(parsed)
      } catch {
        alert('Could not parse file.')
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="import-export">
      <button onClick={handleExport}>Export</button>
      <button onClick={() => fileRef.current?.click()}>Import</button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleImport} hidden />
    </div>
  )
}
