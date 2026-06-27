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
  const isPinching = useVoxelStore((s) => s.isPinching)
  const controlsRef = useRef()
  const { camera } = useThree()
  const velocityRef = useRef({ azimuth: 0, polar: 0 })

  useEffect(() => {
    const dir = camera.position.clone().normalize()
    camera.position.copy(dir.multiplyScalar(cameraDistance))
    controlsRef.current?.update()
  }, [cameraDistance])

  useFrame(() => {
    if (!controlsRef.current) return
    if (isPinching) {
      velocityRef.current.azimuth = 0
      velocityRef.current.polar = 0
      return
    }
    const { azimuth, polar } = orbitDelta
    const active = Math.abs(azimuth) > 0.001 || Math.abs(polar) > 0.001
    if (active) {
      velocityRef.current.azimuth = azimuth * 0.8
      velocityRef.current.polar = polar * 0.8
    } else {
      velocityRef.current.azimuth *= 0.92
      velocityRef.current.polar *= 0.92
    }
    const vaz = velocityRef.current.azimuth
    const vpo = velocityRef.current.polar
    if (Math.abs(vaz) > 0.0001 || Math.abs(vpo) > 0.0001) {
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + vaz)
      controlsRef.current.setPolarAngle(
        Math.max(0.1, Math.min(Math.PI - 0.1, controlsRef.current.getPolarAngle() + vpo))
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
