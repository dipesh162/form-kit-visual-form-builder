'use client'
import { useFormStore } from '@/lib/store'
import { Upload, Download, Eye, EyeOff, Undo2, Redo2 } from 'lucide-react'
import { useRef } from 'react'

export default function BuilderHeader(){
  const { mode, setMode, exportForm, importForm, undo, redo } = useFormStore()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-grid size-8 place-items-center rounded-xl bg-brand-100 text-brand-700">✨</span>
          <div className="font-semibold">FormKit – Visual Form Builder</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="pill" onClick={()=> setMode(mode==='build'?'preview':'build')}>
            {mode==='build' ? <><Eye className="size-4"/> Preview</> : <><EyeOff className="size-4"/> Edit</>}
          </button>
          <button className="pill" onClick={undo}><Undo2 className="size-4"/>Undo</button>
          <button className="pill" onClick={redo}><Redo2 className="size-4"/>Redo</button>
          <button className="pill" onClick={()=>{
            const blob = new Blob([exportForm()], {type:'application/json'})
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'form.json'; a.click(); URL.revokeObjectURL(url)
          }}><Download className="size-4"/>Export</button>
          <>
            <input ref={fileRef} type="file" className="hidden" accept="application/json" onChange={async e=>{
              const f = e.target.files?.[0]; if(!f) return; const t = await f.text(); importForm(t)
            }}/>
            <button className="pill" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/>Import</button>
          </>
        </div>
      </div>
    </header>
  )
}
