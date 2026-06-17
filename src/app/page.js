'use client'
import dynamic from 'next/dynamic'

const VoxelScene = dynamic(() => import('@/components/scene/VoxelScene'), { ssr: false })
const HandTracker = dynamic(() => import('@/components/hand/HandTracker'), { ssr: false })
const HUD = dynamic(() => import('@/components/hud/HUD'), { ssr: false })

export default function Page() {
  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <VoxelScene />
      <HandTracker />
      <HUD />
    </main>
  )
}
