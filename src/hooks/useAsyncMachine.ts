import { useEffect, useState, useMemo } from "react"
import * as Comlink from 'comlink'

export const useAsyncMachine = (Machine) => {
  const worker = useMemo(() => Comlink.wrap(new Machine()), [])
  const [initialState, setInitialState] = useState({ value: 'smallYellow', context: {} })
  const [state, setState] = useState(initialState)

  const send = async (event: string) => {
    const nextState = await worker.transition(state.value, { type: event })
    console.log('next', nextState)
    setState(nextState)
  }

  const getInitialState = async () => {
    const initialState = await worker.initialState
    setInitialState(initialState)
    setState(initialState)
  }

  useEffect(() => {
    getInitialState()
  }, [])

  return [state, send]
}
