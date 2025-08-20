'use client'
import { useFormStore } from '@/lib/store'
import { Upload, Download, Eye, EyeOff, Undo2, Redo2 } from 'lucide-react'
import { useRef } from 'react'

export default function Header() {
  const { mode, setMode, exportForm, importForm, undo, redo } = useFormStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-grid h-8 w-8 place-items-center rounded-xl bg-brand-100 text-brand-700">✨</span>
          <h1 className="font-semibold">FormKit – Visual Form Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pill" onClick={() => setMode(mode === 'build' ? 'preview' : 'build')}>
            {mode === 'build' ? (<><Eye className="h-4 w-4" /> Preview</>) 
                               : (<><EyeOff className="h-4 w-4" /> Edit</>)}
          </button>
          <button className="pill" onClick={undo}><Undo2 className="h-4 w-4" /> Undo</button>
          <button className="pill" onClick={redo}><Redo2 className="h-4 w-4" /> Redo</button>
          <button className="pill" onClick={() => {
            const blob = new Blob([exportForm()], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'form.json'
            a.click()
            URL.revokeObjectURL(url)
          }}>
            <Download className="h-4 w-4" /> Export
          </button>
          {/* Import button (hidden file input) */}
          <>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="application/json" 
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const text = await file.text()
                importForm(text)
              }}
            />
            <button className="pill" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Import
            </button>
          </>
        </div>
      </div>
    </header>
  )
}
