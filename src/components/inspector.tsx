'use client'
import { useFormStore, Field } from '@/lib/store'

export default function Inspector() {
  const { fields, selectedId, update, remove } = useFormStore()
  const field = fields.find(f => f.id === selectedId)

  // If no field is selected, show a placeholder message
  if (!field) {
    return (
      <aside className="w-80 shrink-0 p-4 text-md font-semibold text-ink-500">
        Select a field to edit its properties
      </aside>
    )
  }

  // Shorthand to update the currently selected field
  const updateField = (patch: Partial<Field>) => update(field.id, patch)

  return (
    <aside className="w-80 shrink-0 p-4">
      <div className="mb-3 text-sm font-semibold text-ink-700">Field Settings</div>
      <div className="space-y-4 text-sm">
        {/* Label editor */}
        <label className="block">
          <span className="text-xs font-medium text-ink-700">Label</span>
          <input 
            className="ghost-input mt-1" 
            value={field.label} 
            onChange={e => updateField({ label: e.target.value })} 
          />
        </label>
        {/* Placeholder editor (for inputs, textareas) */}
        <label className="block">
          <span className="text-xs font-medium text-ink-700">Placeholder</span>
          <input 
            className="ghost-input mt-1" 
            value={field.placeholder || ''} 
            onChange={e => updateField({ placeholder: e.target.value })} 
          />
        </label>
        {/* Required toggle */}
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={!!field.required} 
            onChange={e => updateField({ required: e.target.checked })} 
          />
          <span className="text-ink-900">Required field</span>
        </label>
        {/* Helper text editor */}
        <label className="block">
          <span className="text-xs font-medium text-ink-700">Helper Text</span>
          <input 
            className="ghost-input mt-1" 
            value={field.helperText || ''} 
            onChange={e => updateField({ helperText: e.target.value })} 
          />
        </label>

        {/* Options editor (only for select, checkbox, radio types) */}
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-ink-700">Options</div>
            {field.options?.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input 
                  className="ghost-input flex-1"
                  value={opt.label} 
                  onChange={e => {
                    // Update the label of this option
                    const newOptions = field.options!.map((o, i) => 
                      i === idx ? { ...o, label: e.target.value } : o
                    )
                    updateField({ options: newOptions })
                  }}
                />
                <button 
                  type="button" 
                  className="pill text-xs hover:bg-ui-soft"
                  onClick={() => updateField({ options: field.options!.filter(o => o.id !== opt.id) })}
                >
                  Delete
                </button>
              </div>
            ))}
            {/* Button to add a new option */}
            <button 
              type="button" 
              className="pill text-xs hover:bg-ui-soft"
              onClick={() => {
                const newOption = { id: Math.random().toString(36).slice(2, 8), label: 'New Option', value: 'new_option' }
                updateField({ options: [...(field.options || []), newOption] })
              }}
            >
              + Add option
            </button>
          </div>
        )}

        {/* Delete field button */}
        <button 
          type="button" 
          className="text-red-600 hover:underline"
          onClick={() => remove(field.id)}
        >
          🗑️ Delete Field
        </button>
      </div>
    </aside>
  )
}
