'use client'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import Canvas from '@/components/canvas'
import Inspector from '@/components/inspector'
import PixelOverlay from '@/components/overlay'

export default function Builder(){
  return <div className="relative flex min-h-screen flex-col">
    <Header/>
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-6">
      <Sidebar/>
      <Canvas/>
      <Inspector/>
    </div>
    <PixelOverlay/>
  </div>
}
