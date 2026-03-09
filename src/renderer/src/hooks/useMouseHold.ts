import { useCallback, useEffect, useState } from 'react'

export const useMouseHold = (mouseHoldTime, onShortClick): [boolean, () => void, () => void] => {
  const [clickTime, setClickTime] = useState(0) // tracks time since last mouse-down event - used to detect short clicks vs hold clicks
  const [dragging, setDragging] = useState(false) // whether the hold state has been triggered
  const [mouseHolding, setMouseHolding] = useState(false) // user controlling mouse-up or down

  const onMouseDown = useCallback(() => {
    setClickTime(Date.now())
    return setMouseHolding(true)
  }, [setMouseHolding, setClickTime])

  const onMouseUp = useCallback(() => {
    setDragging(false) // force un-drag on mouse up / leave
    return setMouseHolding(false)
  }, [setMouseHolding])

  useEffect(() => {
    if (!mouseHolding && Date.now() - clickTime < mouseHoldTime) {
      onShortClick() // if we unhold click and its short, we want to trigger a "normal" click event
    }
  }, [clickTime, mouseHoldTime, mouseHolding, onShortClick])

  useEffect(() => {
    let timerId
    if (mouseHolding) {
      // trigger the drag after the set amount of time
      timerId = setTimeout(() => setDragging(true), mouseHoldTime)
    }
    return () => {
      clearTimeout(timerId) // clean up old timer when component unmounts / re-renders
      return setDragging(false) // disable dragging - triggered when mouse hold event is changed (e.g. mouse no longer held)
    }
  }, [mouseHoldTime, mouseHolding, setDragging])

  return [dragging, onMouseUp, onMouseDown]
}
