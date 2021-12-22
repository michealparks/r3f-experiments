import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'
import { input } from '../utils/input'
import { MathUtils } from 'three'
import { models } from './store'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.SkinnedMesh
    torso: THREE.Bone
    IKpoleL: THREE.Bone
    IKTargetL: THREE.Bone
    IKpoleR: THREE.Bone
    IKTargetR: THREE.Bone
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

type ActionName = 'armatureAction'
type GLTFActions = Record<ActionName, THREE.AnimationAction>

const FADE_IN_TIME = 0.5
const VELOCITY_DAMP = 7
const MODEL_URL = new URL('./mech.glb', import.meta.url).href

const v2 = new THREE.Vector2()
const v3 = new THREE.Vector3()

let refAngle = 0
let timeoutId = -1

const Player = ({ ...props }: JSX.IntrinsicElements['group']) => {
  const group = useRef<THREE.Group>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const { nodes, materials, animations } = useGLTF(MODEL_URL) as GLTFResult
  const { actions } = useAnimations<GLTFActions>(animations, group)

  useEffect(() => {
    if (group.current) {
      models.set('player', group.current)
    }
  }, [group])

  useFrame(() => {
    const player = group.current
    const cam = camera.current

    if (cam && player) {
      cam.lookAt(player.position)

      v3.set(player.position.x, cam.position.y, player.position.z - 30)
      cam.position.lerp(v3, 0.05)
    }

    if (player) {
      input.process()

      player.position.x += input.x / VELOCITY_DAMP
      player.position.z += input.z / VELOCITY_DAMP

      if (input.x !== 0 || input.z !== 0) {
        if (actions.armatureAction.isRunning() === false) {
          clearTimeout(timeoutId)
          timeoutId = -1
          actions.armatureAction.fadeIn(FADE_IN_TIME).play()
        }

        let endAngle = input.rotation
				const startAngle = v2.set(player.position.z, player.position.x).angle()
				const dif = endAngle - startAngle

        // @todo this was written not to function in a continuous game loop
				// if (dif > Math.PI) {
				// 	refAngle -= Math.PI * 2
				// 	endAngle = refAngle + endAngle
				// } else if (endAngle - startAngle < -Math.PI) {
				// 	refAngle += Math.PI * 2
				// 	endAngle = refAngle + endAngle
				// }

        player.rotation.y = MathUtils.lerp(player.rotation.y, endAngle, 0.1)
      } else if (input.x === 0 && input.z === 0) {
        if (timeoutId === -1) {
          timeoutId = setTimeout(() => actions.armatureAction.stop(), 500)
          actions.armatureAction.fadeOut(0.5)
        }
      }
    }
  })

  return (
    <>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        near={0.01}
        far={1000}
        position={[0, 30, 30]}
      />
      <group ref={group} {...props} dispose={null}>
        <group name='armature' position={[0, 3, 0]}>
          <primitive object={nodes.torso} />
          <primitive object={nodes.IKpoleL} />
          <primitive object={nodes.IKTargetL} />
          <primitive object={nodes.IKpoleR} />
          <primitive object={nodes.IKTargetR} />
          <skinnedMesh
            castShadow
            receiveShadow
            name='Mesh'
            geometry={nodes.Cube.geometry}
            material={materials.Material}
            skeleton={nodes.Cube.skeleton}
          />
        </group>
      </group>
    </>
  )
}

useGLTF.preload(MODEL_URL)

export default Player