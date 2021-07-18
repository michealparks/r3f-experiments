import * as Comlink from 'comlink'
import { createMachine, assign, AnyEventObject } from 'xstate'

export const boxMachine = createMachine({
	id: 'box',
	context: {
		scale: 1,
		color: 'orange',
	},
	initial: 'smallYellow',
	states: {
		smallPink: {
			on: {
				TOGGLE: {
					target: 'largePink',
					actions: 'largePink',
				},
				HOVER_LEAVE: {
					target: 'smallYellow',
					actions: 'smallYellow',
				}
			}
		},
		largePink: {
			on: {
				TOGGLE: {
					target: 'smallPink',
					actions: 'smallPink',
				},
				HOVER_LEAVE: {
					target: 'largeYellow',
					actions: 'largeYellow',
				}
			}
		},
		smallYellow: {
			on: {
				HOVER_ENTER: {
					target: 'smallPink',
					actions: 'smallPink',
				}
			}
		},
		largeYellow: {
			on: {
				HOVER_ENTER: {
					target: 'largePink',
					actions: 'largePink',
				}
			}
		}
	}
}, {
  actions: {
    smallYellow: assign({ color: 'orange', scale: 1.0 }),
    largeYellow: assign({ color: 'orange', scale: 1.5 }),
    smallPink: assign({ color: 'hotpink', scale: 1.0 }),
    largePink: assign({ color: 'hotpink', scale: 1.5 }),
  }
})

Comlink.expose(new class AsyncBoxMachine {
  get initial () {
    return boxMachine.initial
  }

  get initialState () {
    const { value, context } = boxMachine.initialState
    return {
      value,
      context,
    }
  }

  transition (state: string, event: AnyEventObject) {
    const nextState = boxMachine.transition(state, event)
    return {
      value: nextState.value,
      context: nextState.context,
    }
  }
})
