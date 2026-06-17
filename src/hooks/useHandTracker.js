import { useEffect, useRef } from 'react'
import { useVoxelStore } from '@/store/useVoxelStore'
import { isPinching, pinchMidpoint, cameraToWorld } from '@/utils/handUtils'
import { snapToGrid } from '@/utils/gridHelpers'

const MEDIAPIPE_WASM =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'

export function useHandTracker(videoRef) {
  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const lastVideoTimeRef = useRef(-1)
  const wasPinchingRef = useRef(false)

  const setHandData = useVoxelStore((s) => s.setHandData)
  const setCursor = useVoxelStore((s) => s.setCursor)
  const setPinching = useVoxelStore((s) => s.setPinching)
  const placeVoxel = useVoxelStore((s) => s.placeVoxel)
  const eraseVoxel = useVoxelStore((s) => s.eraseVoxel)
  const mode = useVoxelStore((s) => s.mode)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { HandLandmarker, FilesetResolver } = await import(
        '@mediapipe/tasks-vision'
      )

      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM)

      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      })

      if (!cancelled) startLoop()
    }

    function startLoop() {
      function loop() {
        if (!videoRef.current || !landmarkerRef.current) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const video = videoRef.current
        if (video.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const now = performance.now()
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime
          const result = landmarkerRef.current.detectForVideo(video, now)

          if (result.landmarks.length > 0) {
            const landmarks = result.landmarks[0]
            setHandData(landmarks)

            const pinch = isPinching(landmarks)
            setPinching(pinch)

            const mid = pinchMidpoint(landmarks)
            const world = cameraToWorld(mid)
            const snapped = snapToGrid(world)
            setCursor(snapped)

            // Only trigger on pinch start, not every frame
            if (pinch && !wasPinchingRef.current) {
              mode === 'build' ? placeVoxel() : eraseVoxel()
            }
            wasPinchingRef.current = pinch
          } else {
            setHandData(null)
            setPinching(false)
            wasPinchingRef.current = false
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    init()
    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      landmarkerRef.current?.close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
