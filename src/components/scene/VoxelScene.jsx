'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import VoxelGrid from './VoxelGrid'
import CursorBlock from './CursorBlock'

export default function VoxelScene() {
  return (
    <Canvas
      camera={{ position: [8, 8, 12], fov: 55 }}
      style={{ position: 'fixed', inset: 0 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <Environment preset="city" />
      <Grid
        args={[20, 20]}
        position={[0, -0.01, 0]}
        cellColor="#334155"
        sectionColor="#475569"
        fadeDistance={40}
      />
      <VoxelGrid />
      <CursorBlock />
      <OrbitControls makeDefault enablePan />
    </Canvas>
  )
}
