'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useVoxelStore } from '@/store/useVoxelStore'
import { gridToWorld } from '@/utils/gridHelpers'

export default function CursorBlock() {
  const ref = useRef()
  const cursor = useVoxelStore((s) => s.cursor)
  const isPinching = useVoxelStore((s) => s.isPinching)
  const color = useVoxelStore((s) => s.color)

  useFrame(() => {
    if (!ref.current) return
    const { x, y, z } = gridToWorld(cursor)
    ref.current.position.lerp(new THREE.Vector3(x, y, z), 0.2)
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={isPinching ? 0.9 : 0.35}
        wireframe={!isPinching}
      />
    </mesh>
  )
}
