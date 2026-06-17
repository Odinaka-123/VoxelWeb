'use client'
import { useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import VoxelGrid from './VoxelGrid'
import CursorBlock from './CursorBlock'
import { useVoxelStore } from '@/store/useVoxelStore'

function CameraController() {
  const cameraDistance = useVoxelStore((s) => s.cameraDistance)
  const orbitDelta = useVoxelStore((s) => s.orbitDelta)
  const controlsRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    const dir = camera.position.clone().normalize()
    camera.position.copy(dir.multiplyScalar(cameraDistance))
    controlsRef.current?.update()
  }, [cameraDistance])

  useFrame(() => {
    if (!controlsRef.current) return
    const { azimuth, polar } = orbitDelta
    if (Math.abs(azimuth) > 0.001 || Math.abs(polar) > 0.001) {
      controlsRef.current.setAzimuthalAngle(
        controlsRef.current.getAzimuthalAngle() + azimuth * 0.8
      )
      controlsRef.current.setPolarAngle(
        Math.max(0.1, Math.min(Math.PI - 0.1,
          controlsRef.current.getPolarAngle() + polar * 0.8
        ))
      )
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      enableZoom
      enableRotate
      zoomSpeed={1.5}
      minDistance={2}
      maxDistance={50}
    />
  )
}

export default function VoxelScene() {
  return (
    <Canvas
      camera={{ position: [8, 8, 12], fov: 55 }}
      style={{ position: 'fixed', inset: 0 }}
      onCreated={({ gl }) => gl.setClearColor('#0a0a0f', 1)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <Grid
        args={[20, 20]}
        position={[0, -0.01, 0]}
        cellColor="#334155"
        sectionColor="#475569"
        fadeDistance={40}
      />
      <VoxelGrid />
      <CursorBlock />
      <CameraController />
    </Canvas>
  )
}
