import { useCallback, useState } from 'react'

export type ToggleActions = {
  state: boolean
  toggleState: () => void
  setState: (newState: boolean) => void
  toggleOff: () => void
  toggleOn: () => void
}

export const useToggleSwitch = (init = false): ToggleActions => {
  const [state, setState] = useState(init)
  const toggleState = useCallback(() => setState((b) => !b), [setState])
  const toggleOn = useCallback(() => setState(true), [setState])
  const toggleOff = useCallback(() => setState(false), [setState])

  return { state, toggleState, setState, toggleOff, toggleOn }
}
