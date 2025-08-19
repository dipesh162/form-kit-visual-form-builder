'use client'
import * as React from 'react'
import { useFormStore } from '@/lib/store'
import { FieldRenderer } from '@/components/fields/FieldRenderer'
import { useForm, FormProvider } from 'react-hook-form'
import { useMemo } from 'react'
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useSortable, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'

function SortableItem({ id, index, onClick, selected, children }:{ id:string, index:number, onClick:()=>void, selected:boolean, children:React.ReactNode }){
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div onClick={onClick} className={`card p-5 transition ${selected?'ring-2 ring-brand-300 border-brand-400':'hover:border-brand-200'}`}>
        {children}
      </div>
    </div>
  )
}

export default function Canvas(){
  const { fields, reorder, select, selectedId, mode } = useFormStore()
  const methods = useForm({ defaultValues: useMemo(()=> Object.fromEntries(fields.map(f => [f.id, ''])), [fields]) })
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if(over && active.id !== over.id){
      const oldIndex = fields.findIndex(f => f.id === active.id)
      const newIndex = fields.findIndex(f => f.id === over.id)
      reorder(oldIndex, newIndex)
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-sm text-ink-500">{mode === 'build' ? 'Drag to reorder. Select a field to edit.' : 'Preview mode – the form is interactive.'}</div>
        <FormProvider {...methods}>
          <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={rectSwappingStrategy}>
              <div className="space-y-3">
                {fields.map((f, idx) => (
                  <SortableItem key={f.id} id={f.id} index={idx} onClick={() => select(mode === 'build' ? f.id : undefined)} selected={selectedId === f.id && mode === 'build'}>
                    <FieldRenderer field={f} designMode={mode === 'build'}/>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </FormProvider>
      </div>
    </main>
  )
}
