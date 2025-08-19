'use client'
import { useFormStore } from '@/lib/store'
const LIB = [
  { type:'text', label:'Text' },
  { type:'textarea', label:'Text area' },
  { type:'select', label:'Select' },
  { type:'checkbox', label:'Checkbox' },
  { type:'radio', label:'Radio group' },
  { type:'email', label:'Email' },
  { type:'number', label:'Number' },
] as const

export default function Sidebar(){
  const add = useFormStore(s=>s.add)
  return (
    <aside className="w-72 shrink-0 p-4">
      <div className="mb-3 text-sm font-semibold text-ink-700">Select type</div>
      <div className="grid grid-cols-1 gap-2">
        {LIB.map(item => (
          <button key={item.type} onClick={()=>add(item.type as any)} className="flex items-center justify-between rounded-xl border border-[rgb(var(--border))] bg-white p-3 hover:border-brand-300">
            <div className="text-sm font-medium">{item.label}</div>
            <span className="text-ink-300">→</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
