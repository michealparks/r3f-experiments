import * as THREE from 'three'
import React from 'react'
import { useRef } from 'react'
import { context, useFrame } from '@react-three/fiber'
import { useMachine } from '@xstate/react'
import { createMachine, assign } from 'xstate'
import { useSpring, animated, config } from '@react-spring/three'


const boxMachine = createMachine({
	id: 'box',
	context: {
		scale: 1,
		color: 'orange'
	},
	initial: 'smallYellow',
	states: {
		smallPink: {
			on: {
				TOGGLE: {
					target: 'largePink',
					actions: assign({ scale: 1.5 })
				},
				HOVER_LEAVE: {
					target: 'smallYellow',
					actions: assign({ color: 'orange' })
				}
			}
		},
		largePink: {
			on: {
				TOGGLE: {
					target: 'smallPink',
					actions: assign({ scale: 1 })
				},
				HOVER_LEAVE: {
					target: 'largeYellow',
					actions: assign({ color: 'orange' })
				}
			}
		},
		smallYellow: {
			on: {
				HOVER_ENTER: {
					target: 'smallPink',
					actions: assign({ color: 'hotpink' })
				}
			}
		},
		largeYellow: {
			on: {
				HOVER_ENTER: {
					target: 'largePink',
					actions: assign({ color: 'hotpink' })
				}
			}
		}
	}
})

export const Box = (props: JSX.IntrinsicElements['mesh']) => {
	const ref = useRef<THREE.Mesh>(null!)
	const [state, send] = useMachine(boxMachine)
	const springs = useSpring(state.context)

  useFrame((_, delta) => {
		ref.current.rotation.x += delta
		ref.current.rotation.y += delta
	})

  return (
    <animated.mesh
      {...props}
      ref={ref}
			scale={springs.scale}
      onClick={() => send('TOGGLE')}
      onPointerOver={() => send('HOVER_ENTER')}
      onPointerOut={() => send('HOVER_LEAVE')}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={state.context.color} />
    </animated.mesh>
  )
}
