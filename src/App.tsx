import React from 'react'
import { Canvas } from '@react-three/fiber'
import Box from './Box'
import logo from './logo.svg'
import './App.css'

export default () => {
  return (
    <>
      <Canvas id="canvas" dpr={Math.min(devicePixelRatio, 2)}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
      <div className="App">
        {/* ui goes here */}
      </div>
    </>
  )
}
