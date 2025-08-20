'use client'
import { useFormStore } from '@/lib/store'
import { FieldRenderer } from '@/components/fields/FieldRenderer'
import { useForm, FormProvider } from 'react-hook-form'
import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useSortable, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'

/** Sortable card with a drag handle so clicks still select the field */
function SortableItem({
  id, onSelect, selected, children
}:{ id:string; onSelect:()=>void; selected:boolean; children:React.ReactNode }){
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition
  }
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className={`card group p-5 transition ${selected ? 'ring-2 ring-brand-300 border-brand-400' : 'hover:border-brand-200'}`}>
        {/* drag handle (only the handle is draggable) */}
        <button
          className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-md border bg-white p-1 text-ink-500 shadow-sm group-hover:inline-flex"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div onClick={onSelect}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Canvas(){
  const { fields, select, selectedId, mode } = useFormStore()
  // Make the whole canvas a droppable target so palette items can be dropped anywhere
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas' })

  const methods = useForm({
    defaultValues: useMemo(() => Object.fromEntries(fields.map(f => [f.id, ''])), [fields])
  })
  const { handleSubmit } = methods

  const onSubmit = () => alert('Form submitted!')

  return (
    <main ref={setNodeRef} className={`flex-1 overflow-auto p-4 lg:p-6 ${isOver ? 'outline outline-2 outline-dashed outline-brand-300 rounded-xl' : ''}`}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-sm text-ink-500">
          {mode === 'build' ? 'Drag new fields here or reorder existing ones. Click a field to edit in the inspector.'
                            : 'Preview mode — fill and submit to test validation.'}
        </div>

        <FormProvider {...methods}>
          <SortableContext items={fields.map(f=>f.id)} strategy={rectSwappingStrategy}>
            <div className="space-y-4">
              {fields.map((f) => (
                <SortableItem
                  key={f.id}
                  id={f.id}
                  selected={mode==='build' && selectedId===f.id}
                  onSelect={()=> select(mode==='build' ? f.id : undefined)}
                >
                  <FieldRenderer field={f} designMode={mode==='build'} />
                </SortableItem>
              ))}
              {fields.length===0 && (
                <div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-ink-500">
                  Drag components from the left, or click any component to add it here.
                </div>
              )}
            </div>
          </SortableContext>

          {mode==='preview' && (
            <div className="mt-6">
              <button className="pill bg-brand-600 text-white hover:bg-brand-700" onClick={handleSubmit(onSubmit)}>
                Submit Form
              </button>
            </div>
          )}
        </FormProvider>
      </div>
    </main>
  )
}
