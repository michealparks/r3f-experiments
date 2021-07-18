import React, { Suspense, useEffect } from 'react'
import { Canvas, addEffect, addAfterEffect } from '@react-three/fiber'
import Stats from '@drecom/stats.js'
import { Box } from './Box'
import { Postprocessing } from './Postprocessing'
import { nanoid } from 'nanoid'

const App = () => {
  if (import.meta.env.MODE === 'development') {
    useEffect(() => {
      const stats = new Stats({ maxFPS: Infinity, maxMem: Infinity })
      document.body.appendChild(stats.dom)

      addEffect(() => { stats.begin() })
      addAfterEffect(() => { stats.end() })
    }, [])
  }

  const boxes = []
  const distance = 10
  for (let i = 0; i < 5; i += 1) {
    const x = (Math.random() - 0.5) * distance
    const y = (Math.random() - 0.5) * distance
    const z = (Math.random() - 0.5) * distance
    boxes.push(<Box key={nanoid()} position={[x, y, z]} />)
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
        {boxes}
      </Canvas>
    </Suspense>
  )
}

export default App
