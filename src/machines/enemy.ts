import { createMachine, assign } from 'xstate'

export const enemyMachine = createMachine({
  id: 'enemy',
  initial: 'inactive',
  context: {
    interval: 3.0,
    wanderDirection: { x: 0, y: 0 }
  },
  states: {
    inactive: {
      on: { START: 'wander' }
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
