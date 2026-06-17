'use client'
import { useEffect, useRef, useState } from 'react'
import { useHandTracker } from '@/hooks/useHandTracker'

export default function HandTracker() {
  const videoRef = useRef(null)
  const [status, setStatus] = useState('Starting webcam...')

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStatus('Webcam ready — loading hand model...')
        }
      })
      .catch((err) => {
        console.error('[HandTracker] webcam error:', err)
        setStatus('Webcam error: ' + err.message)
      })
  }, [])

  useHandTracker(videoRef, setStatus)

  return (
    <>
      {/* Status badge */}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        background: 'rgba(0,0,0,0.7)',
        color: '#94a3b8',
        fontSize: 11,
        padding: '4px 10px',
        borderRadius: 12,
        zIndex: 30,
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none',
      }}>
        {status}
      </div>

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
    </>
  )
}
