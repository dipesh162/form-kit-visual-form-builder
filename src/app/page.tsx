import Link from 'next/link'
export default function Home(){
  return <div className="grid min-h-screen place-items-center px-6">
    <div className="card max-w-xl p-8 text-center">
      <div className="mx-auto mb-4 inline-grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-700">✨</div>
      <h1 className="mb-2 text-2xl font-bold">FormKit – Visual Form Builder</h1>
      <p className="mb-6 text-sm text-ink-500">Drag, drop, and design delightful forms. Pixel-perfect tools included.</p>
      <Link href="/builder" className="pill bg-brand-600 text-md font-semibold py-2 px-4 text-white border-brand-600 hover:bg-brand-500">Start building →</Link>
    </div>
  </div>
}
