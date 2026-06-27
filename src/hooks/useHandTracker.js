import { useEffect, useRef } from 'react'
import { useVoxelStore } from '@/store/useVoxelStore'
import { isPinching, pinchMidpoint, cameraToWorld, handOpenness, palmCenter } from '@/utils/handUtils'
import { snapToGrid } from '@/utils/gridHelpers'

const MEDIAPIPE_WASM =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'

function smooth(prev, next, alpha = 0.35) {
  if (!prev) return next
  return {
    x: prev.x + alpha * (next.x - prev.x),
    y: prev.y + alpha * (next.y - prev.y),
    z: (prev.z ?? 0) + alpha * ((next.z ?? 0) - (prev.z ?? 0)),
  }
}

export function useHandTracker(videoRef, setStatus) {
  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const lastVideoTimeRef = useRef(-1)
  const wasPinchingRef = useRef(false)
  const prevTwoHandDistRef = useRef(null)
  const prevPalmRef = useRef(null)
  const prevPalmTimeRef = useRef(null)
  const smoothedMidRef = useRef(null)
  const lastSnappedRef = useRef(null)

  const setHandData = useVoxelStore((s) => s.setHandData)
  const setCursor = useVoxelStore((s) => s.setCursor)
  const setPinching = useVoxelStore((s) => s.setPinching)
  const setIsZooming = useVoxelStore((s) => s.setIsZooming)
  const setIsPanning = useVoxelStore((s) => s.setIsPanning)
  const setOrbitDelta = useVoxelStore((s) => s.setOrbitDelta)
  const placeVoxel = useVoxelStore((s) => s.placeVoxel)
  const eraseVoxel = useVoxelStore((s) => s.eraseVoxel)
  const setCameraDistance = useVoxelStore((s) => s.setCameraDistance)
  const mode = useVoxelStore((s) => s.mode)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        setStatus?.('Downloading hand model...')
        const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
        setStatus?.('Initialising MediaPipe...')
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM)

        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })

        setStatus?.('✅ Ready')
        if (!cancelled) startLoop()
      } catch (err) {
        console.error('[useHandTracker]', err)
        setStatus?.('❌ Error: ' + err.message)
      }
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
          const count = result.landmarks.length

          // ── TWO HANDS: pinch-to-zoom ──────────────────────────────
          if (count === 2) {
            const p0 = isPinching(result.landmarks[0])
            const p1 = isPinching(result.landmarks[1])
            if (p0 && p1) {
              setIsZooming(true)
              const mid0 = pinchMidpoint(result.landmarks[0])
              const mid1 = pinchMidpoint(result.landmarks[1])
              const dx = mid0.x - mid1.x
              const dy = mid0.y - mid1.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (prevTwoHandDistRef.current !== null) {
                const delta = prevTwoHandDistRef.current - dist
                setCameraDistance((prev) => Math.max(2, Math.min(50, prev + delta * 40)))
              }
              prevTwoHandDistRef.current = dist
              setStatus?.('Zooming...')
            } else {
              setIsZooming(false)
              prevTwoHandDistRef.current = null
              setStatus?.('2 hands — pinch both to zoom')
            }
            setIsPanning(false)
            prevPalmRef.current = null
            prevPalmTimeRef.current = null
            wasPinchingRef.current = false
            smoothedMidRef.current = null
            setHandData(result.landmarks[0])
            rafRef.current = requestAnimationFrame(loop)
            return
          }

          setIsZooming(false)
          prevTwoHandDistRef.current = null

          // ── ONE HAND ──────────────────────────────────────────────
          if (count === 1) {
            const landmarks = result.landmarks[0]
            setHandData(landmarks)

            const pinch = isPinching(landmarks)
            const openness = handOpenness(landmarks)
            const isOpen = openness > 0.7 && !pinch

            if (isOpen) {
              smoothedMidRef.current = null
              lastSnappedRef.current = null
              setIsPanning(true)
              setPinching(false)
              const palm = palmCenter(landmarks)
              const t = performance.now()

              if (prevPalmRef.current && prevPalmTimeRef.current) {
                const dt = Math.max(1, t - prevPalmTimeRef.current)
                const dx = palm.x - prevPalmRef.current.x
                const dy = palm.y - prevPalmRef.current.y
                const speedX = (dx / dt) * 1000
                const speedY = (dy / dt) * 1000
                // ── Sensitivity cranked up ──
                setOrbitDelta({ azimuth: speedX * 0.25, polar: speedY * 0.18 })
              } else {
                setOrbitDelta({ azimuth: 0, polar: 0 })
              }

              prevPalmRef.current = palm
              prevPalmTimeRef.current = t
              setStatus?.('Panning...')
            } else {
              setIsPanning(false)
              prevPalmRef.current = null
              prevPalmTimeRef.current = null
              setPinching(pinch)

              const rawMid = pinchMidpoint(landmarks)
              smoothedMidRef.current = smooth(smoothedMidRef.current, rawMid, 0.2)
              const world = cameraToWorld(smoothedMidRef.current)
              const snapped = snapToGrid(world)

              const last = lastSnappedRef.current
              const changed = !last ||
                last.x !== snapped.x ||
                last.y !== snapped.y ||
                last.z !== snapped.z

              if (changed) {
                lastSnappedRef.current = snapped
                setCursor(snapped)
              }

              if (pinch && !wasPinchingRef.current) {
                mode === 'build' ? placeVoxel() : eraseVoxel()
              }
              setStatus?.(`1 hand${pinch ? ' — pinching' : ' — open'}`)
            }
            wasPinchingRef.current = pinch
          } else {
            setHandData(null)
            setPinching(false)
            setIsPanning(false)
            prevPalmRef.current = null
            prevPalmTimeRef.current = null
            smoothedMidRef.current = null
            lastSnappedRef.current = null
            wasPinchingRef.current = false
            setOrbitDelta({ azimuth: 0, polar: 0 })
            setStatus?.('✅ Ready — show your hand')
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
