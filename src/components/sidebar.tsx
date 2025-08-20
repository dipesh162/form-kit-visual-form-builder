'use client'
import { useFormStore } from '@/lib/store'
import { useDraggable } from '@dnd-kit/core'

// Define the available field types in the library
const FIELD_TYPES = [
  { type: 'text',     label: 'Text' },
  { type: 'textarea', label: 'Text Area' },
  { type: 'select',   label: 'Select Dropdown' },
  { type: 'checkbox', label: 'Checkbox Group' },
  { type: 'radio',    label: 'Radio Group' },
  { type: 'email',    label: 'Email' },
  { type: 'number',   label: 'Number' }
] as const

function DraggablePaletteItem({ item, onClick }:{ item:{type:string;label:string}, onClick:()=>void }){
  // Use a stable id for draggable palette items
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: { type: 'LIB_ITEM', fieldType: item.type }
  })
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border border-[rgb(var(--border))] bg-white px-4 py-3 transition
        ${isDragging ? 'opacity-60 ring-2 ring-brand-300' : 'hover:border-brand-300'}`}
      aria-label={`Drag or click to add ${item.label}`}
    >
      <span className="text-md font-medium">{item.label}</span>
      <span className="text-ink-300">⠿</span>
    </button>
  )
}

export default function Sidebar() {
  const add = useFormStore(s=>s.add)

  return (
    <aside className="w-full shrink-0 p-4 lg:w-72">
      <div className="mb-3 text-md font-semibold text-ink-700">Component Library (drag or click)</div>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-1">
        {FIELD_TYPES.map(item => (
           <DraggablePaletteItem key={item.type} item={item} onClick={()=>add(item.type as any)} />
        ))}
      </div>
    </aside>
  )
}
