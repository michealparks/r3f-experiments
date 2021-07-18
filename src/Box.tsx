import * as THREE from 'three'
import React from 'react'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import BoxMachine from './machines/box?worker'
import { useAsyncMachine } from './hooks/useAsyncMachine'
import * as Comlink from 'comlink'

let count = 0
export const Box = (props: JSX.IntrinsicElements['mesh']) => {
	const ref = useRef<THREE.Mesh>(null!)
	const [state, send] = useAsyncMachine(BoxMachine)
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
