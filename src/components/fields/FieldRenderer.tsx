'use client'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import type { Field } from '@/lib/store'

export function FieldRenderer({ field, designMode = false }: { field: Field; designMode?: boolean }) {
  const { register, formState: { errors } } = useFormContext()
  // Setup validation rules: if field is required, use a custom message
  const rules = { required: field.required ? `${field.label} is required` : false }

  // Common label element
  const Label = () => (
    <label className="text-sm font-semibold text-ink-900">
      {field.label}
      {field.required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )

  // Text, Email, Number inputs
  if (field.type === 'text' || field.type === 'email' || field.type === 'number') {
    return (
      <div className="space-y-2">
        <Label />
        <input
          disabled={designMode}
          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
          placeholder={field.placeholder}
          className="ghost-input"
          {...register(field.id, rules)}
        />
        {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
        {errors[field.id] && (
          <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
        )}
      </div>
    )
  }

  // Text Area (multi-line text)
  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label />
        <textarea
          disabled={designMode}
          placeholder={field.placeholder}
          className="ghost-input min-h-[112px]"
          {...register(field.id, rules)}
        />
        {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
        {errors[field.id] && (
          <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
        )}
      </div>
    )
  }

  // Select Dropdown
  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <Label />
        <select
          disabled={designMode}
          className="ghost-input"
          {...register(field.id, rules)}
        >
          <option value="">Please select</option>
          {field.options?.map(opt => (
            <option key={opt.id} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
        {errors[field.id] && (
          <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
        )}
      </div>
    )
  }

  // Radio Button Group
  if (field.type === 'radio') {
    return (
      <div className="space-y-2">
        <Label />
        <div className="grid grid-cols-2 gap-2">
          {field.options?.map(opt => (
            <label 
              key={opt.id} 
              className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2"
            >
              <input
                disabled={designMode}
                type="radio"
                value={opt.value}
                className="accent-brand-600"
                {...register(field.id, rules)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
        {errors[field.id] && (
          <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
        )}
      </div>
    )
  }

  // Checkbox Group
  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        <Label />
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-2">
              <input
                disabled={designMode}
                type="checkbox"
                value={opt.value}
                className="accent-brand-600"
                {...register(field.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
        {/* Note: For checkbox groups, "required" validation would need custom logic to ensure at least one is checked */}
      </div>
    )
  }

  // Fallback for unknown field types
  return <div>Unknown field type: {field.type}</div>
}
