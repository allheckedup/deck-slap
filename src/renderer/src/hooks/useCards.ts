import { useCallback, useEffect, useState } from 'react'
import { MTGCard } from '@shared/types/card'
import { compareStr, MATCH_MODE } from '@shared/types/searchQuery'

export type CardMatch = {
  name?: string
  set?: string
  cN?: string
}

export const useCards = (fetcher: () => Promise<Array<MTGCard>>) => {
  const [allCards, setAllCards] = useState<Array<MTGCard>>([])
  useEffect(() => {
    fetcher()
      .then(setAllCards)
      .catch((e) => {
        console.error(`Found an issue getting cards from main process: ${e}`)
      })
  }, [fetcher, setAllCards])

  const filterCards = useCallback(
    (matches: Array<CardMatch>, mode?: MATCH_MODE) =>
      allCards.filter((c) =>
        matches.some(
          ({ name, set, cN }) =>
            (!name || compareStr(c.name, name, { mode })) &&
            (!cN || compareStr(c.collectorNumber, cN, { mode: MATCH_MODE.EXACT })) &&
            (!set || compareStr(c.set?.code ?? '', set, { mode: MATCH_MODE.EXACT }))
        )
      ),
    [allCards]
  )

  return { allCards, filterCards }
}
