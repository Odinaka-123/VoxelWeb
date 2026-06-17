'use client'
import { useVoxelStore } from '@/store/useVoxelStore'
import { gridToWorld } from '@/utils/gridHelpers'

export default function VoxelGrid() {
  const voxels = useVoxelStore((s) => s.voxels)

  return (
    <>
      {Object.entries(voxels).map(([key, { color }]) => {
        const [gx, gy, gz] = key.split(',').map(Number)
        const { x, y, z } = gridToWorld({ x: gx, y: gy, z: gz })
        return (
          <mesh key={key} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}
    </>
  )
}
