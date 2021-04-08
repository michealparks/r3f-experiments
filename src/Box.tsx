import type { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import React, { useState, useRef } from 'react'

export default (props: JSX.IntrinsicElements['mesh']) => {
	const meshref = useRef<THREE.Mesh>(null!)
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)

	useFrame((state, dt) => {
		meshref.current.rotation.x += dt
	})

	return (
		<mesh
			{...props}
			ref={meshref}
			scale={active ? 1.5: 1}
			onClick={() => setActive(!active)}
			onPointerOver={() => setHover(true)}
			onPointerOut={() => setHover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	)
}
