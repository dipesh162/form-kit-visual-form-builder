'use client'
import { useFormStore } from '@/lib/store'
import { FieldRenderer } from '@/components/fields/FieldRenderer'
import { useForm, FormProvider } from 'react-hook-form'
import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useSortable, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import { GripVertical, MousePointer2, Layers } from 'lucide-react'

/** Sortable card with a drag handle and elevated, glossy look */
function SortableItem({
  id, onSelect, selected, children
}:{ id:string; onSelect:()=>void; selected:boolean; children:React.ReactNode }){
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({ id })
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* gradient border wrapper */}
      <div
        className={[
          "rounded-2xl p-[1px]",
          selected
            ? "bg-gradient-to-br from-brand-400/80 via-brand-300/50 to-brand-200/50"
            : "bg-gradient-to-br from-transparent via-transparent to-transparent group hover:from-brand-200/40 hover:to-brand-100/30"
        ].join(' ')}
      >
        <div
          className={[
            "relative rounded-[14px] border bg-white/90 backdrop-blur",
            "border-[rgb(var(--border))] shadow-sm transition-all",
            "hover:shadow-lg hover:-translate-y-[1px]",
            selected ? "ring-2 ring-brand-300 border-transparent" : "",
            isSorting ? "shadow-xl" : ""
          ].join(' ')}
        >
          {/* drag handle */}
          <button
            className={[
              "absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-md",
              "border bg-white/95 p-1.5 text-ink-500 shadow-sm",
              "group-hover:inline-flex focus:outline-none focus:ring-2 focus:ring-brand-300"
            ].join(' ')}
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div onClick={onSelect} className="p-5">
            {children}
          </div>
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
    <main
      ref={setNodeRef}
      className={[
        "flex-1 overflow-auto p-4 lg:p-6 rounded-xl",
        // soft background with subtle texture + glow when dragging over
        "bg-[radial-gradient(1200px_600px_at_30%_-10%,#eef2ff_10%,transparent_55%)]",
        "bg-[length:100%_100%]",
        isOver ? "outline outline-2 outline-dashed outline-brand-300 shadow-[0_0_0_6px_rgba(99,102,241,0.08)_inset]" : ""
      ].join(' ')}
    >
      <div className="mx-auto max-w-3xl">
        {/* top bar chip */}
        <div className="mb-5 flex flex-col items-start gap-2 text-sm text-ink-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white/90 px-3 py-1.5 shadow-sm">
            <Layers className="h-4 w-4 text-brand-600" />
            <span className="font-medium">{mode === 'build' ? 'Builder Canvas' : 'Live Preview'}</span>
          </span>
          <span className="opacity-70">
            {mode === 'build'
              ? 'Drag new fields here or reorder existing ones. Click a field to edit settings.'
              : 'Fill the form and click Submit to test validation.'}
          </span>
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
                <div
                  className={[
                    "rounded-2xl border border-dashed border-[rgb(var(--border))]",
                    "bg-white/70 px-6 py-14 text-center backdrop-blur-sm",
                    "transition hover:border-brand-200"
                  ].join(' ')}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <MousePointer2 className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-ink-800">Drop components here</div>
                  <div className="mt-1 text-xs text-ink-500">
                    Or click any item in the library to add it
                  </div>
                </div>
              )}
            </div>
          </SortableContext>

          {mode==='preview' && (
            <div className="mt-6">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-300"
                onClick={handleSubmit(onSubmit)}
              >
                Submit Form
              </button>
            </div>
          )}
        </FormProvider>
      </div>
    </main>
  )
}
