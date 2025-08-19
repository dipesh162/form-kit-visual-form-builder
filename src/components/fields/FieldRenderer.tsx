'use client'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import type { Field } from '@/lib/store'

export function FieldRenderer({ field, designMode=false }:{ field: Field, designMode?: boolean }){
  const { register } = useFormContext()
  const req = { required: field.required ? `${field.label} is required` : false } as any

  const Label = () => <label className="text-sm font-semibold text-ink-900">{field.label}{field.required && <span className="ml-1 text-red-500">*</span>}</label>

  if(field.type==='text' || field.type==='email' || field.type==='number'){
    return <div className="space-y-2">
      <Label/>
      <input disabled={designMode} type={field.type==='number'?'number':(field.type==='email'?'email':'text')} placeholder={field.placeholder} className="ghost-input" {...register(field.id, req)}/>
      {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
    </div>
  }
  if(field.type==='textarea'){
    return <div className="space-y-2">
      <Label/>
      <textarea disabled={designMode} placeholder={field.placeholder} className="ghost-input min-h-[112px]" {...register(field.id, req)}/>
      {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
    </div>
  }
  if(field.type==='select'){
    return <div className="space-y-2">
      <Label/>
      <select disabled={designMode} className="ghost-input" {...register(field.id, req)}>
        <option value="">Please select</option>
        {field.options?.map(o => <option key={o.id} value={o.value}>{o.label}</option>)}
      </select>
      {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
    </div>
  }
  if(field.type==='radio'){
    return <div className="space-y-2">
      <Label/>
      <div className="grid grid-cols-2 gap-2">
        {field.options?.map(o => <label key={o.id} className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2">
          <input disabled={designMode} type="radio" value={o.value} className="accent-brand-600" {...register(field.id, req)}/>
          <span>{o.label}</span>
        </label>)}
      </div>
      {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
    </div>
  }
  if(field.type==='checkbox'){
    return <div className="space-y-2">
      <Label/>
      <div className="space-y-2">
        {field.options?.map(o => <label key={o.id} className="flex items-center gap-2">
          <input disabled={designMode} type="checkbox" value={o.value} className="accent-brand-600" {...register(field.id)}/>
          <span>{o.label}</span>
        </label>)}
      </div>
      {field.helperText && <p className="text-xs text-ink-500">{field.helperText}</p>}
    </div>
  }
  return <div>Unknown field</div>
}
