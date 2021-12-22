import React from 'react'
import { CameraShake } from '@react-three/drei'

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
      <CameraShake {...{
        maxYaw: 0.1, // Max amount camera can yaw in either direction
        maxPitch: 0.1, // Max amount camera can pitch in either direction
        maxRoll: 0.1, // Max amount camera can roll in either direction
        yawFrequency: 1, // Frequency of the the yaw rotation
        pitchFrequency: 1, // Frequency of the pitch rotation
        rollFrequency: 1, // Frequency of the roll rotation
        intensity: 1, // initial intensity of the shake
        decay: false, // should the intensity decay over time
        decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
        additive: true, // this should be used when your scene has orbit controls
      }} />
    </EffectComposer>
  )
}
