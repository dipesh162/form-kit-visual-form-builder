'use client'

// React 
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent, closestCenter } from '@dnd-kit/core'

// Components
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import Canvas from '@/components/canvas'
import Inspector from '@/components/inspector'

// Zustand
import { useFormStore } from '@/lib/store'

export default function Builder() {
  const { fields, reorder, insertAt, setMode } = useFormStore()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return

    const activeType = active.data.current?.type as string | undefined

    // 1) Drag from sidebar into canvas
    if (activeType === 'LIB_ITEM') {
      const fieldType = active.data.current?.fieldType
      // If dropped over a field, insert before that field; if over canvas, append
      const overId = over.id?.toString()
      const targetIndex = fields.findIndex(f => f.id === overId)
      if (targetIndex >= 0) insertAt(targetIndex, fieldType)
      else insertAt(fields.length, fieldType)
      return
    }

    // 2) Reordering existing fields on canvas (sortable to sortable)
    const fromId = active.id?.toString()
    const toId = over.id?.toString()
    if (!fromId || !toId || fromId === toId) return

    const oldIndex = fields.findIndex(f => f.id === fromId)
    const newIndex = fields.findIndex(f => f.id === toId)
    if (oldIndex >= 0 && newIndex >= 0) reorder(oldIndex, newIndex)
  }

  return <div className="relative flex min-h-screen flex-col">
    <Header />
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 lg:flex-row">
        <Sidebar />
        <Canvas />
        <Inspector />
      </div>
    </DndContext>
  </div>
}
