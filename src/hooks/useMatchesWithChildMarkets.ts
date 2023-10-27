import { useEffect, useState } from 'react'
import { groupBy, toPairs } from 'lodash'
import { SportMarket } from '@/__generated__/resolvers-types'
import { SGPItem } from '@/typescript/types'
import { BetType } from '@/utils/tags'

export const useMatchesWithChildMarkets = (matches: SportMarket[], sgpFees: SGPItem[] | undefined, filterDuplicates = false) => {
	const [matchesWithChildMarkets, setMatchesWithChildMarkets] = useState<any>(undefined)

	useEffect(() => {
		const newMatchesWithChildMarkets = toPairs(groupBy(matches, 'gameId')).map(([, markets]) => {
			const [match] = markets

			const winnerTypeMatch = markets.find((market) => Number(market.betType) === BetType.WINNER)
			const doubleChanceTypeMatches = markets.filter((market) => Number(market.betType) === BetType.DOUBLE_CHANCE)
			// NOTE: filter paused spread and total bet types (bet types with isPaused = true add 0 odds).
			// TODO: maybe we show those options in future (need refactor find to filter and remove && !market.isPaused)
			const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD && !market.isPaused)
			const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL && !market.isPaused)
			const combinedTypeMatch = sgpFees?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
			return {
				...(winnerTypeMatch ?? matches.find((item) => item.gameId === match?.gameId)),
				winnerTypeMatch,
				doubleChanceTypeMatches,
				spreadTypeMatch,
				totalTypeMatch,
				combinedTypeMatch
			}
		})

		if (filterDuplicates) {
			newMatchesWithChildMarkets.filter((item) => item.winnerTypeMatch)
		}

		setMatchesWithChildMarkets(newMatchesWithChildMarkets)
	}, [matches, sgpFees, filterDuplicates])

	return matchesWithChildMarkets
}
