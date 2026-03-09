import { useCallback } from 'react'

export const useDragPosition = (open, dragging) => {
  return useCallback(
    (p: number, offset = 0) => (open && !dragging ? p : 0) + offset,
    [open, dragging]
  )
}
