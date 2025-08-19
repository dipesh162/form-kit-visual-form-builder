'use client'
import { useFormStore, Field } from '@/lib/store'

export default function Inspector(){
  const { fields, selectedId, update, remove } = useFormStore()
  const field = fields.find(f=>f.id===selectedId)
  if(!field) return <aside className="w-80 shrink-0 p-4 text-sm text-ink-500">Select a field to edit</aside>
  const on = (patch: Partial<Field>) => update(field.id, patch)

  return (
    <aside className="w-80 shrink-0 p-4">
      <div className="mb-2 text-sm font-semibold text-ink-700">Field settings</div>
      <div className="space-y-3 text-sm">
        <label className="block space-y-1"><span className="text-sm font-medium">Label</span><input className="ghost-input" value={field.label} onChange={e=>on({label:e.target.value})}/></label>
        <label className="block space-y-1"><span className="text-sm font-medium">Placeholder</span><input className="ghost-input" value={field.placeholder||''} onChange={e=>on({placeholder:e.target.value})}/></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!field.required} onChange={e=>on({required:e.target.checked})}/><span>Required</span></label>
        <label className="block space-y-1"><span className="text-sm font-medium">Helper text</span><input className="ghost-input" value={field.helperText||''} onChange={e=>on({helperText:e.target.value})}/></label>

        {(field.type==='select'||field.type==='radio'||field.type==='checkbox') && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Options</div>
            <div className="space-y-2">
              {field.options?.map((o, idx) => (
                <div key={o.id} className="flex items-center gap-2">
                  <input className="ghost-input flex-1" value={o.label} onChange={e=> on({ options: field.options!.map((x,i)=> i===idx?{...x,label:e.target.value}:x) }) }/>
                  <button className="pill text-xs" onClick={()=> on({ options: field.options!.filter(x=>x.id!==o.id) })}>Delete</button>
                </div>
              ))}
              <button className="pill text-xs" onClick={()=> on({ options: [...(field.options||[]), {id:Math.random().toString(36).slice(2,8), label:'New option', value:'new_option'}] })}>Add option</button>
            </div>
          </div>
        )}
        <button className="text-red-600 underline" onClick={()=>remove(field.id)}>Delete field</button>
      </div>
    </aside>
  )
}
