import { floor } from 'lodash'
import { IMatch } from '@/typescript/types'
import { Position, PositionType } from '@/__generated__/resolvers-types'
import { OddsType, OPTIMISM_DIVISOR } from '../constants'
import { BET_OPTIONS } from '../enums'
import { formatCurrency } from './currency'

export const formatQuote = (oddsType: OddsType, quote: number | undefined | null | string): string => {
	if (!quote) {
		return '0'
	}

	switch (oddsType) {
		case OddsType.DECIMAL:
			return `${formatCurrency(1 / Number(quote), 2)}`
		case OddsType.AMERICAN:
			// eslint-disable-next-line no-case-declarations
			const decimal = 1 / Number(quote)
			if (decimal >= 2) {
				return `+${formatCurrency((decimal - 1) * 100, 0)}`
			}
			return `-${formatCurrency(100 / (decimal - 1), 0)}`

		case OddsType.AMM:
		default:
			return `${formatCurrency(quote, quote < 0.1 ? 4 : 2)}`
	}
}

export const formatParlayQuote = (quote: number | undefined, oddType?: OddsType) => {
	if (!quote) return ''
	// AMM odds.
	const ammOdds = quote / OPTIMISM_DIVISOR

	return formatQuote(oddType || OddsType.DECIMAL, ammOdds)
}

export const formatPositionOdds = (match: Position, oddType: OddsType) => {
	switch (match.side) {
		case PositionType.Away: {
			const ammOdds = Number(match.market.awayOdds) / OPTIMISM_DIVISOR
			return formatQuote(oddType, Number(ammOdds))
		}
		case PositionType.Draw: {
			const ammOdds = Number(match.market.drawOdds) / OPTIMISM_DIVISOR
			return formatQuote(oddType, ammOdds)
		}

		case PositionType.Home: {
			const ammOdds = Number(match.market.homeOdds) / OPTIMISM_DIVISOR
			return formatQuote(oddType, ammOdds)
		}
		default:
			return 0
	}
}

const formatMatchCombinedPositionsQuote = (position1: number, position2: number, SGPFee: number, oddType: OddsType) => {
	const odd = { formattedOdd: formatQuote(oddType, position1 * position2), rawOdd: position1 * position2 }
	if (SGPFee) {
		return {
			formattedOdd: floor(Number(odd.formattedOdd) * SGPFee, 2).toFixed(2),
			rawOdd: Number(odd.rawOdd)
		}
	}

	return odd
}

export const formattedCombinedTypeMatch = (match: IMatch, oddType: OddsType, customBetOption?: BET_OPTIONS) => {
	const betOption = customBetOption || match.betOption

	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(match.combinedTypeMatch?.SGPFee),
			oddType
		)
	}
	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.awayOdds),
			Number(match.combinedTypeMatch?.SGPFee),
			oddType
		)
	}
	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.awayOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(match.combinedTypeMatch?.SGPFee),
			oddType
		)
	}
	return formatMatchCombinedPositionsQuote(
		Number(match.winnerTypeMatch?.awayOdds),
		Number(match.totalTypeMatch?.awayOdds),
		Number(match.combinedTypeMatch?.SGPFee),
		oddType
	)
}
