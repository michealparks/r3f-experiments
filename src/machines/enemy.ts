import { createMachine, assign } from 'xstate'

interface Context {
  interval: number
  wanderDirection: {
    x: number 
    y: number
  }
}

type Events =
  | { type: 'START', interval: number }
  | { type: 'TICK' }
  | { type: 'PLAYER_SEEN' }
  | { type: 'PLAYER_NOT_SEEN' }
  | { type: 'PLAYER_IN_REACH' }
  | { type: 'PLAYER_OUT_OF_REACH' }
  | { type: 'PLAYER_DIED' }

export const enemyMachine = createMachine<Context, Events>({
  id: 'enemy',
  initial: 'inactive',
  context: {
    interval: 5.0,
    wanderDirection: { x: 0, y: 0 }
  },
  states: {
    inactive: {
      on: {
        START: {
          target: 'wander',
          actions: 'setGameConfig'
        }
      }
    },
    wander: {
      invoke: {
        src: 'tick',
      },
      on: {
        TICK: {
          target: 'wander',
          actions: 'setWanderDirection'
        },
        PLAYER_SEEN: 'chase',
      }
    },
    chase: {
      on: {
        PLAYER_NOT_SEEN: 'wander',
        PLAYER_IN_REACH: 'attack',
      }
    },
    attack: {
      on: {
        PLAYER_OUT_OF_REACH: 'chase',
        PLAYER_DIED: 'wander',
      }
    }
  }
}, {
  services: {
    tick: (ctx, _event) => (cb) => {
      console.log('tick')
      const id = setTimeout(cb, 1000 * ctx.interval, 'TICK')
      return () => clearTimeout(id)
    }
  },
  actions: {
    setGameConfig: assign((_ctx, event) => {
      if (event.type !== 'START') return {}

      return {
        interval: event.interval
      }
    }),
    setWanderDirection: assign((_ctx, _event) => {
      return {
        wanderDirection: {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
        }
      }
    })
  }
})