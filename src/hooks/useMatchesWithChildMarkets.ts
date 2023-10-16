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
			const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD)
			const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL)
			const combinedTypeMatch = sgpFees?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
			if (match?.tags?.[0] === '9001') {
				console.log(match?.tags?.[0])
				console.log(combinedTypeMatch)
			}
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

	// console.log(sgpFees)

	return matchesWithChildMarkets
}
