import React, { Suspense, useEffect } from 'react'
import { Canvas, addEffect, addAfterEffect } from '@react-three/fiber'
import Stats from '@drecom/stats.js'
import { Box } from './Box'
import { Postprocessing } from './Postprocessing'


const App = () => {
  if (import.meta.env.MODE === 'development') {
    useEffect(() => {
      const stats = new Stats({ maxFPS: Infinity, maxMem: Infinity })
      document.body.appendChild(stats.dom)
      addEffect(() => stats.begin())
      addAfterEffect(() => stats.end())
    }, [])
  }

  return (
    <Suspense fallback={null}>
      <Canvas mode='concurrent'
        gl={{ antialias: false }}
        dpr={Math.min(2, devicePixelRatio)}
        camera={{ position: [0, 0, 20], near: 0.01, far: 1000 }}
      >
        <Postprocessing />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </Suspense>
  )
}

export default App
