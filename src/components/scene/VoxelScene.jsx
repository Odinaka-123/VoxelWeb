'use client'
import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import VoxelGrid from './VoxelGrid'
import CursorBlock from './CursorBlock'
import { useVoxelStore } from '@/store/useVoxelStore'

function CameraController() {
  const cameraDistance = useVoxelStore((s) => s.cameraDistance)
  const { camera } = useThree()

  useEffect(() => {
    const dir = camera.position.clone().normalize()
    camera.position.copy(dir.multiplyScalar(cameraDistance))
  }, [cameraDistance])

  return null
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <CameraController />
      <Grid
        args={[20, 20]}
        position={[0, -0.01, 0]}
        cellColor="#334155"
        sectionColor="#475569"
        fadeDistance={40}
      />
      <VoxelGrid />
      <CursorBlock />
      <OrbitControls makeDefault enablePan enableZoom enableRotate zoomSpeed={1.5} minDistance={2} maxDistance={50} />
    </>
  )
}

export default function VoxelScene() {
  return (
    <Canvas
      camera={{ position: [8, 8, 12], fov: 55 }}
      style={{ position: 'fixed', inset: 0 }}
      onCreated={({ gl }) => gl.setClearColor('#0a0a0f', 1)}
    >
      <SceneContent />
    </Canvas>
  )
}
