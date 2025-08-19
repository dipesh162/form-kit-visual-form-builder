import { create } from 'zustand'

export type FieldType = 'text'|'textarea'|'select'|'checkbox'|'radio'|'number'|'email'
export type Option = { id:string; label:string; value:string }
export type Field = { id:string; type:FieldType; label:string; placeholder?:string; required?:boolean; helperText?:string; options?:Option[] }

type History = { past: Field[][]; future: Field[][] }
type State = {
  fields: Field[]; selectedId?: string; mode:'build'|'preview'; history:History;
  add:(t:FieldType)=>void; select:(id?:string)=>void; update:(id:string,patch:Partial<Field>)=>void;
  remove:(id:string)=>void; reorder:(from:number,to:number)=>void; setMode:(m:'build'|'preview')=>void;
  exportForm:()=>string; importForm:(json:string)=>void; undo:()=>void; redo:()=>void
}

const uid = (n=8)=> Math.random().toString(36).slice(2, 2+n)
const pushPast = (s:State):History => ({ past:[...s.history.past, s.fields.map(f=>({...f}))], future:[] })

export const useFormStore = create<State>((set,get)=>({
  fields: [], selectedId:undefined, mode:'build', history:{past:[], future:[]},
  add: (t)=> set(s=>{
    const field: Field = { id:uid(), type:t, label:t[0].toUpperCase()+t.slice(1), placeholder:'', required:false, helperText:'',
      options: (t==='select'||t==='checkbox'||t==='radio')?[{id:uid(6),label:'Option 1',value:'option_1'},{id:uid(6),label:'Option 2',value:'option_2'}]:undefined
    }
    return { fields:[...s.fields, field], selectedId:field.id, history:pushPast(s) }
  }),
  select: (id)=> set({selectedId:id}),
  update: (id,patch)=> set(s=>({ fields: s.fields.map(f=> f.id===id?{...f,...patch}:f), history:pushPast(s) })),
  remove: (id)=> set(s=>({ fields: s.fields.filter(f=>f.id!==id), selectedId:undefined, history:pushPast(s) })),
  reorder: (from,to)=> set(s=>{ const a=[...s.fields]; const [m]=a.splice(from,1); a.splice(to,0,m); return { fields:a, history:pushPast(s) } }),
  setMode: (m)=> set({mode:m}),
  exportForm: ()=> JSON.stringify(get().fields, null, 2),
  importForm: (json)=> set({ fields: JSON.parse(json), selectedId: undefined }),
  undo: ()=> set(s=>{ const past=[...s.history.past]; if(!past.length) return {}; const prev=past.pop()!; const future=[s.fields.map(f=>({...f})), ...s.history.future]; return { fields:prev, history:{past, future} } }),
  redo: ()=> set(s=>{ const future=[...s.history.future]; if(!future.length) return {}; const next=future.shift()!; const past=[...s.history.past, s.fields.map(f=>({...f}))]; return { fields:next, history:{past, future} } }),
}))
