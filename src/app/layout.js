import './globals.css'

export const metadata = {
  title: 'VoxelWeb',
  description: 'Gesture-controlled voxel builder in the browser',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0f', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
