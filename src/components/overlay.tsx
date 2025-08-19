'use client'
import { useState, useRef } from 'react'
export default function PixelOverlay(){
  const [src, setSrc] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(0.5)
  const [enabled, setEnabled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* controls */}
      <div className="pointer-events-auto fixed right-4 top-20 card p-3">
        <div className="mb-2 text-sm font-semibold">Pixel-perfect overlay</div>
        <div className="flex items-center gap-2">
          <button className="pill" onClick={()=> inputRef.current?.click()}>Upload image</button>
          <label className="pill"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)} className="mr-2"/>Enabled</label>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e=>{
          const f = e.target.files?.[0]; if(!f) return;
          const url = URL.createObjectURL(f); setSrc(url); setEnabled(true)
        }}/>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span>Opacity</span>
          <input className="w-40" type="range" min={0} max={1} step={0.01} value={opacity} onChange={e=> setOpacity(parseFloat(e.target.value))}/>
          <span className="tabular-nums">{Math.round(opacity*100)}%</span>
        </div>
      </div>
      {enabled && src && <img src={src} style={{opacity}} className="pointer-events-none absolute inset-0 m-auto h-full w-full object-contain" alt="overlay"/>}
    </div>
  )
}
