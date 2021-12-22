import React, { Suspense, useEffect } from 'react'
import { Canvas, addEffect, addAfterEffect, useFrame } from '@react-three/fiber'
import Stats from '@drecom/stats.js'
import { Postprocessing } from './Postprocessing'
import Player from './models/Player'
import Enemy from './models/Enemy'
import Lights from './Lights'

const App = () => {
  if (import.meta.env.MODE === 'development') {
    useEffect(() => {
      const stats = new Stats({ maxFPS: Infinity, maxMem: Infinity })
      document.body.appendChild(stats.dom)

      addEffect(() => { stats.begin() })
      addAfterEffect(() => { stats.end() })
    }, [])
  }

  return (
    <Suspense fallback={null}>
      <Canvas
        shadows
        mode='concurrent'
        gl={{ antialias: false }}
        dpr={Math.min(2, devicePixelRatio)}
      >
        <Postprocessing />
        <Lights />

        <Enemy />
        <mesh scale={5} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry attach='geometry' args={[10, 10]} />
          <meshPhongMaterial attach='material' color="blue" />
        </mesh> 
        <Player />
      </Canvas>
    </Suspense>
  )
}

export default App
