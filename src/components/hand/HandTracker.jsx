'use client'
import { useEffect, useRef } from 'react'
import { useHandTracker } from '@/hooks/useHandTracker'

export default function HandTracker() {
  const videoRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch((err) => console.error('[HandTracker] webcam error:', err))
  }, [])

  useHandTracker(videoRef)

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 180,
        height: 135,
        borderRadius: 8,
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 10,
        transform: 'scaleX(-1)',
      }}
    />
  )
}
