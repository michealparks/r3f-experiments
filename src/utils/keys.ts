const pressed = new Set()

document.addEventListener('keydown', (e) => {
  pressed.add(e.key)
}, { passive: true })

document.addEventListener('keyup', (e) => {
  pressed.delete(e.key)
}, { passive: true })

export const keys = {
  pressed
}
