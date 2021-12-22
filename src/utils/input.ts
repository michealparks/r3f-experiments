import * as THREE from 'three'
import { keys } from './keys'

const process = () => {
  input.x = 0
  input.z = 0

  for (const key of keys.pressed) {
    switch (key) {
      case 'a': input.x = +1; break;
      case 'd': input.x = -1; break;
      case 'w': input.z = +1; break;
      case 's': input.z = -1; break;
    }
  }

  input.direction.set(input.z, input.x)
  input.rotation = input.direction.angle()
}

export const input = {
  x: 0,
  z: 0,
  rotation: 0,
  direction: new THREE.Vector2(),
  process,
}
