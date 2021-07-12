import React from 'react'

import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  SMAA,
} from '@react-three/postprocessing'

export const Postprocessing = () => {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.3}
        bokehScale={3}
        height={480}
      />
      <Bloom
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        intensity={0.3}
        height={480}
        kernelSize={5}
      />
      <Noise
        opacity={0.02}
      />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={1.0}
      />
    </EffectComposer>
  )
}
