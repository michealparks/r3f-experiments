import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useMachine } from '@xstate/react';
import { enemyMachine } from '../machines/enemy'
import { useFrame } from '@react-three/fiber';
import { models } from './store';
import { MathUtils } from 'three';

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

const v2 = new THREE.Vector2()
const MODEL_URL = new URL('./mech2.glb', import.meta.url).href

const FADE_IN_TIME = 0.5
const CHASE_THRESHOLD = 13
const ATTACK_THRESHOLD = 3
const VELOCITY_DAMP = 0.08

let lastDistance = Infinity

const Enemy = ({ ...props }: JSX.IntrinsicElements['group']) => {
  const [state, send] = useMachine(enemyMachine)
  const group = useRef<THREE.Group>()
  const { nodes, materials, animations } = useGLTF(MODEL_URL) as GLTFResult
  const { actions } = useAnimations<GLTFActions>(animations, group)

  useEffect(() => {
    send('START')
  }, [])

  useFrame(() => {
    const player = models.get('player')
    const enemy = group.current
    if (player && enemy) {
      const distance = player.position.distanceTo(enemy.position)

      if (lastDistance > ATTACK_THRESHOLD && distance <= ATTACK_THRESHOLD) {
        send('PLAYER_IN_REACH')
        actions.armatureAction.stop()
      } else if (lastDistance <= ATTACK_THRESHOLD && distance > ATTACK_THRESHOLD) {
        send('PLAYER_OUT_OF_REACH')
        actions.armatureAction.fadeIn(FADE_IN_TIME).play()
      } else if (lastDistance > CHASE_THRESHOLD && distance <= CHASE_THRESHOLD) {
        send('PLAYER_SEEN')
        actions.armatureAction.fadeIn(FADE_IN_TIME).play()
      } else if (lastDistance <= CHASE_THRESHOLD && distance > CHASE_THRESHOLD) {
        send('PLAYER_NOT_SEEN')
        actions.armatureAction.stop()
      }

      lastDistance = distance

      switch (state.value) {
        case 'wander':
          const { wanderDirection } = state.context
          
          if (wanderDirection.x === 0 && wanderDirection.y === 0) {
            actions.armatureAction.stop()
          } else {
            actions.armatureAction.play()
          }

          v2.set(
            wanderDirection.x,
            wanderDirection.y
          ).normalize()
          enemy.position.x += wanderDirection.x * VELOCITY_DAMP
          enemy.position.z += wanderDirection.y * VELOCITY_DAMP
          enemy.rotation.y = MathUtils.lerp(enemy.rotation.y, -v2.negate().angle() - (Math.PI / 2), 0.1)
          break
        case 'chase':
          v2.set(
            player.position.x - enemy.position.x,
            player.position.z - enemy.position.z
          ).normalize()
          enemy.position.x += v2.x * VELOCITY_DAMP
          enemy.position.z += v2.y * VELOCITY_DAMP
          enemy.rotation.y = MathUtils.lerp(enemy.rotation.y, -v2.negate().angle() - (Math.PI / 2), 0.1)
          break
        case 'attack':
          break
      }
    }

    console.log(state.value)
  })

  return (
    <>
      <group position={[0.1, 0, 0.1]} ref={group} {...props} dispose={null}>
        <group position={[0, 3, 0]}>
          <primitive object={nodes.torso} />
          <primitive object={nodes.IKpoleL} />
          <primitive object={nodes.IKTargetL} />
          <primitive object={nodes.IKpoleR} />
          <primitive object={nodes.IKTargetR} />
          <skinnedMesh
            geometry={nodes.Cube.geometry}
            material={materials.Material}
            skeleton={nodes.Cube.skeleton}
          />
        </group>
      </group>
    </>
  )
}

export default Enemy