import { Contract } from 'ethers'
import dayjs from 'dayjs'
import networkConnector from './networkConnector'

// types
import { CombinedMarketsPositionName, MarketData, SportMarketInfo } from '@/typescript/types'
import { OddsType, PositionNumber, STABLE_DECIMALS } from './constants'
import { BetType, DoubleChanceMarketType } from './tags'
import { PositionType, SportMarket } from '@/__generated__/resolvers-types'
import { BET_OPTIONS, BONUS_PROPERTY, ODDS_PROPERTY } from './enums'
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// helpers
import { bigNumberFormatter, bigNumberFormmaterWithDecimals } from './formatters/ethers'

// eslint-disable-next-line import/no-cycle
import { formatQuote } from './helpers'

export const isMarketAvailable = (market: SportMarket) => {
	return !!(
		market.isOpen &&
		!market.isPaused &&
		!market.isCanceled &&
		(Number(market.homeOdds) !== 0 ||
			Number(market.awayOdds) !== 0 ||
			(Number(market.drawOdds) || 0) !== 0 ||
			(market.betType && Number(market?.betType) === BetType.DOUBLE_CHANCE)) &&
		dayjs(Number(market.maturityDate) * 1000).isAfter(dayjs())
	)
}

export const getMarketAddressesFromSportMarketArray = (markets: SportMarketInfo[]): string[] => {
	return markets.map((market) => market.address)
}

export enum GlobalFiltersEnum {
	OpenMarkets = 'OpenMarkets',
	PendingMarkets = 'PendingMarkets',
	ResolvedMarkets = 'ResolvedMarkets',
	Canceled = 'Canceled'
}

export const getPositionFromBetOption = (betOption: BET_OPTIONS) => {
	switch (betOption) {
		case BET_OPTIONS.WINNER_DRAW:
			return PositionNumber.DRAW
		case BET_OPTIONS.WINNER_AWAY:
		case BET_OPTIONS.HANDICAP_AWAY:
		case BET_OPTIONS.TOTAL_UNDER:
			return PositionNumber.AWAY
		default:
			return PositionNumber.HOME
	}
}

export const getOddsPropertyFromBetOption = (betOption: BET_OPTIONS) => {
	switch (betOption) {
		case BET_OPTIONS.WINNER_DRAW:
		case BET_OPTIONS.DOUBLE_CHANCE_DRAW:
			return ODDS_PROPERTY.DRAW
		case BET_OPTIONS.WINNER_AWAY:
		case BET_OPTIONS.HANDICAP_AWAY:
		case BET_OPTIONS.TOTAL_UNDER:
			return ODDS_PROPERTY.AWAY
		default:
			return ODDS_PROPERTY.HOME
	}
}

export const getBonusPropertyFromBetOption = (betOption: BET_OPTIONS) => {
	switch (betOption) {
		case BET_OPTIONS.WINNER_DRAW:
		case BET_OPTIONS.DOUBLE_CHANCE_DRAW:
			return BONUS_PROPERTY.DRAW
		case BET_OPTIONS.WINNER_AWAY:
		case BET_OPTIONS.HANDICAP_AWAY:
		case BET_OPTIONS.TOTAL_UNDER:
			return BONUS_PROPERTY.AWAY
		default:
			return BONUS_PROPERTY.HOME
	}
}

export const getMatchByBetOption = (betOption: BET_OPTIONS, position: TicketPosition) => {
	if ([BET_OPTIONS.WINNER_HOME, BET_OPTIONS.WINNER_DRAW, BET_OPTIONS.WINNER_AWAY].includes(betOption)) return position.winnerTypeMatch
	if ([BET_OPTIONS.DOUBLE_CHANCE_HOME, BET_OPTIONS.DOUBLE_CHANCE_DRAW, BET_OPTIONS.DOUBLE_CHANCE_AWAY].includes(betOption)) {
		if (betOption === BET_OPTIONS.DOUBLE_CHANCE_HOME)
			return position.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
		if (betOption === BET_OPTIONS.DOUBLE_CHANCE_DRAW)
			return position.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)
		if (betOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY)
			return position.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
	}
	if ([BET_OPTIONS.HANDICAP_HOME, BET_OPTIONS.HANDICAP_AWAY].includes(betOption)) return position.spreadTypeMatch
	return position.totalTypeMatch
}

export const getPossibleBetOptions = (market: TicketPosition) => {
	let possibleBetOptions: BET_OPTIONS[] = []

	if (market.winnerTypeMatch) {
		if (market.winnerTypeMatch.homeOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.WINNER_HOME]
		if (market.winnerTypeMatch.drawOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.WINNER_DRAW]
		if (market.winnerTypeMatch.awayOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.WINNER_AWAY]
	}
	if (market.doubleChanceTypeMatches && market.doubleChanceTypeMatches.length > 0) {
		market.doubleChanceTypeMatches.forEach((doubleChanceTypeMatch) => {
			// 1X
			if (doubleChanceTypeMatch.homeOdds && doubleChanceTypeMatch.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
				possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.DOUBLE_CHANCE_HOME]
			// X2
			if (doubleChanceTypeMatch.homeOdds && doubleChanceTypeMatch.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
				possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.DOUBLE_CHANCE_AWAY]
			// 12
			if (doubleChanceTypeMatch.homeOdds && doubleChanceTypeMatch.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)
				possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.DOUBLE_CHANCE_DRAW]
		})
	}
	if (market.spreadTypeMatch) {
		if (market.spreadTypeMatch.homeOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.HANDICAP_HOME]
		if (market.spreadTypeMatch.awayOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.HANDICAP_AWAY]
	}
	if (market.combinedTypeMatch) {
		possibleBetOptions = [
			...possibleBetOptions,
			BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER,
			BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER,
			BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER,
			BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER
		]
	}
	if (market.totalTypeMatch) {
		if (market.totalTypeMatch.homeOdds) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.TOTAL_OVER]
		if (market.totalTypeMatch.awayBonus) possibleBetOptions = [...possibleBetOptions, BET_OPTIONS.TOTAL_UNDER]
	}

	return possibleBetOptions
}

/**
 * Get the odds of a match based on the position side (home, away, draw) and the market odds (homeOdds, awayOdds, drawOdds)
 * @param side
 * @param hexOdds
 * @returns  Odds of the match in decimal format (e.g. 1.5)
 */
export const getMatchOddsContract = (side: PositionType, hexOdds: any) => {
	if (side === PositionType.Home) {
		// TODO: OddsType from filter
		return formatQuote(OddsType.DECIMAL, bigNumberFormatter(hexOdds?.[0])) // homeOdds
	}
	if (side === PositionType.Away) {
		return formatQuote(OddsType.DECIMAL, bigNumberFormatter(hexOdds?.[1])) // awayOdds
	}
	if (side === PositionType.Draw) {
		return formatQuote(OddsType.DECIMAL, bigNumberFormatter(hexOdds?.[2])) // drawOdds
	}
	return ''
}

export const convertPositionNameToPosition = (side: PositionType) => {
	if (side === PositionType.Home) return 0
	if (side === PositionType.Away) return 1
	if (side === PositionType.Draw) return 2
	return 1
}

export const getSymbolText = (
	position: PositionNumber,
	market: SportMarketInfo | MarketData | SportMarket,
	combinedMarketPositionSymbol?: CombinedMarketsPositionName
) => {
	if (combinedMarketPositionSymbol) {
		return combinedMarketPositionSymbol
	}

	switch (position) {
		case PositionNumber.HOME:
			switch (Number(market.betType)) {
				case BetType.SPREAD:
					return 'H1'
				case BetType.TOTAL:
					return 'O'
				case BetType.DOUBLE_CHANCE:
					switch (market.doubleChanceMarketType) {
						case DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE:
							return '1X'
						case DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE:
							return 'X2'
						case DoubleChanceMarketType.NO_DRAW:
							return '12'
						default:
							return ''
					}
				default:
					return '1'
			}
		case PositionNumber.AWAY:
			switch (Number(market.betType)) {
				case BetType.SPREAD:
					return 'H2'
				case BetType.TOTAL:
					return 'U'
				default:
					return '2'
			}
		case PositionNumber.DRAW:
			return 'X'
		default:
			return ''
	}
}

export const formatMarketOdds = (oddsType: OddsType, market?: SportMarketInfo) => {
	const awayOdds = market?.awayOdds ? formatQuote(oddsType, Number(market.awayOdds)) : '0'
	const homeOdds = market?.homeOdds ? formatQuote(oddsType, Number(market.homeOdds)) : '0'
	const drawOdds = market?.drawOdds ? formatQuote(oddsType, Number(market.drawOdds)) : '0'

	return {
		...market,
		awayOdds,
		homeOdds,
		drawOdds
	}
}

export const convertPriceImpactToBonus = (priceImpact: number): number => -((priceImpact / (1 + priceImpact)) * 100)

export const getMarketOddsFromContract = async (markets: SportMarket[]) => {
	const { sportPositionalMarketDataContract, sportMarketManagerContract } = networkConnector
	const numberOfActiveMarkets = await sportMarketManagerContract?.numActiveMarkets()

	const numberOfBatches = Math.trunc(numberOfActiveMarkets / 100) + 1

	const promisesOdds: Contract[] = []
	const promisesPrices: Contract[] = []

	Array.from(Array(numberOfBatches)).forEach((_, i) => {
		promisesOdds.push(sportPositionalMarketDataContract?.getOddsForAllActiveMarketsInBatches(i, 100))
		promisesPrices.push(sportPositionalMarketDataContract?.getPriceImpactForAllActiveMarketsInBatches(i, 100))
	})

	const promisesResult = await Promise.all([...promisesOdds, ...promisesPrices])

	const oddsFromContract = promisesResult.slice(0, numberOfBatches).flat(1)
	const priceImpactFromContract = promisesResult.slice(numberOfBatches, numberOfBatches + numberOfBatches).flat(1)
	return markets.map((market) => {
		const oddsItem = oddsFromContract.find((obj: any) => obj[0].toString().toLowerCase() === market.address.toLowerCase())
		const priceImpactItem = priceImpactFromContract.find((obj: any) => obj[0].toString().toLowerCase() === market.address.toLowerCase())
		if (oddsItem || priceImpactItem) {
			return {
				...market,
				homeOdds: oddsItem ? bigNumberFormmaterWithDecimals(oddsItem.odds[0], STABLE_DECIMALS.sUSD) : market.homeOdds,
				awayOdds: oddsItem ? bigNumberFormmaterWithDecimals(oddsItem.odds[1], STABLE_DECIMALS.sUSD) : market.awayOdds,
				drawOdds: oddsItem && oddsItem.odds[2] ? bigNumberFormmaterWithDecimals(oddsItem.odds[2], STABLE_DECIMALS.sUSD) : undefined,
				homeBonus: priceImpactItem ? convertPriceImpactToBonus(bigNumberFormmaterWithDecimals(priceImpactItem.priceImpact[0])) : undefined,
				awayBonus: priceImpactItem ? convertPriceImpactToBonus(bigNumberFormmaterWithDecimals(priceImpactItem.priceImpact[1])) : undefined,
				drawBonus:
					priceImpactItem && priceImpactItem.priceImpact[2]
						? convertPriceImpactToBonus(bigNumberFormmaterWithDecimals(priceImpactItem.priceImpact[2]))
						: undefined
			}
		}
		return {
			...market,
			homeOdds: bigNumberFormmaterWithDecimals(market.homeOdds),
			awayOdds: bigNumberFormmaterWithDecimals(market.awayOdds),
			drawOdds: market.drawOdds ? bigNumberFormmaterWithDecimals(market.drawOdds) : undefined
		}
	})
}

export const getFormattedBonus = (bonus: number | undefined) => `+${Math.ceil(Number(bonus))}%`
