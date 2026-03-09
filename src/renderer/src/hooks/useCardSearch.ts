import { FormEventHandler, useCallback, useMemo, useState } from 'react'
import { MTGCard } from 'src/shared/types/card'

export const useCardSearch = (
  allCards: Array<MTGCard>
): [Array<MTGCard>, FormEventHandler<HTMLInputElement>, string | null] => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const filteredCards = useMemo(() => {
    if (!searchTerm) return allCards
    return allCards.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [allCards, searchTerm])

  const nonMsg = !allCards.length
    ? 'Looks empty in here'
    : !filteredCards.length
      ? 'No results'
      : null
  const onInput = useCallback(
    (e) => {
      e.preventDefault()
      setSearchTerm(e.target.value)
    },
    [setSearchTerm]
  )
  return [filteredCards, onInput, nonMsg]
}
