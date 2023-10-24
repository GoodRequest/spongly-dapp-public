import dayjs from 'dayjs'
import Router from 'next/router'
import { floor, groupBy, max, toNumber, toPairs } from 'lodash'
import { AnyAction, Dispatch } from 'redux'
import { ethers } from 'ethers'
import { IUnsubmittedBetTicket, TicketPosition, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'

import {
	CLOSED_TICKET_TYPE,
	COLLATERALS,
	ETHERSCAN_TX_URL_ARBITRUM,
	ETHERSCAN_TX_URL_OPTIMISM,
	ETHERSCAN_TX_URL_OPTIMISM_GOERLI,
	MATCH_STATUS,
	MSG_TYPE,
	Network,
	NETWORK_IDS,
	NOTIFICATION_TYPE,
	OddsType,
	OPTIMISM_DIVISOR,
	ORDER_DIRECTION,
	PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_10,
	PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20,
	PARLAY_LEADERBOARD_FIRST_PERIOD_TOP_10_REWARDS,
	PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_10,
	PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20,
	SGPCombinationsFromContractOrderMapping,
	STABLE_COIN,
	STABLE_DECIMALS,
	START_OF_BIWEEKLY_PERIOD,
	TICKET_TYPE,
	TOTAL_WINNER_TAGS,
	USER_TICKET_TYPE
} from './constants'
import {
	BET_OPTIONS,
	COMBINED_BET_OPTIONS,
	ContractSGPOrder,
	DoubleChanceMarketType,
	LIST_TYPE,
	MARKET_PROPERTY,
	MATCH_RESULT,
	RESOLUTIONS,
	RESULT_TYPE,
	WALLET_TICKETS
} from './enums'
import { ParlayMarket, Position, PositionBalance, PositionType, SportMarket } from '@/__generated__/resolvers-types'

import {
	CombinedMarketsPositionName,
	IMatch,
	ITicket,
	PositionWithCombinedAttrs,
	SGPContractData,
	SGPItem,
	Sorter,
	SportMarketInfo,
	UserTicket
} from '@/typescript/types'

import { bigNumberFormatter, bigNumberFormmaterWithDecimals } from '@/utils/formatters/ethers'
import { getFormattedBonus, convertPositionNameToPosition } from '@/utils/markets'
import { BetType } from '@/utils/tags'

import OptimismIcon from '@/assets/icons/optimism-icon.svg'
import ArbitrumIcon from '@/assets/icons/arbitrum-icon.svg'

import { formatParlayQuote, formatPositionOdds, formatQuote, formattedCombinedTypeMatch } from './formatters/quote'
import { roundToTwoDecimals } from './formatters/number'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'
import { roundPrice } from './formatters/currency'
import { showNotifications } from './tsxHelpers'

export const getCurrentBiweeklyPeriod = () => {
	const startOfPeriod = dayjs(START_OF_BIWEEKLY_PERIOD)
	const now = dayjs()
	return Math.trunc(now.diff(startOfPeriod, 'day') / 14)
}

export const getWhenCurrentBiweeklyPeriodEnds = (biWeeklyPeriod: number) => {
	let endOfPeriod = dayjs(START_OF_BIWEEKLY_PERIOD)
	const now = dayjs()
	endOfPeriod = endOfPeriod.add(biWeeklyPeriod * 2, 'week')

	const diffDays = endOfPeriod.diff(now, 'day')
	endOfPeriod = endOfPeriod.subtract(diffDays, 'day')
	const diffHours = endOfPeriod.diff(now, 'hour')
	endOfPeriod = endOfPeriod.subtract(diffHours, 'hour')
	const diffMinutes = endOfPeriod.diff(now, 'minute')

	return `${diffDays}d ${diffHours}h ${diffMinutes}m`
}

export const getPeriodEndsText = (period: number, t: any) => {
	if (period < getCurrentBiweeklyPeriod()) {
		return t('Period has ended')
	}
	if (period > getCurrentBiweeklyPeriod()) {
		return t('Period has not started')
	}

	return `${t('Period ends in')}: ${getWhenCurrentBiweeklyPeriodEnds(period + 1)}`
}

export const translateMessageType = (msgType: MSG_TYPE, t: any) => {
	switch (msgType) {
		case MSG_TYPE.ERROR:
			return t('Error')
		case MSG_TYPE.WARNING:
			return t('Warning')
		case MSG_TYPE.SUCCESS:
			return t('Success')
		case MSG_TYPE.INFO:
			return t('Info')
		default:
			return ''
	}
}

export const pickListTypeFromQuery = (type: string | undefined) => {
	switch (type) {
		case LIST_TYPE.TICKETS:
			return LIST_TYPE.TICKETS
		case LIST_TYPE.MATCHES:
			return LIST_TYPE.MATCHES
		default:
			return LIST_TYPE.TICKETS
	}
}

export const getTicketsTypeName = (type: string, t: any) => {
	switch (type) {
		case TICKET_TYPE.HOT_TICKET:
			return t('Hot tickets')
		case TICKET_TYPE.CLOSED_TICKET:
			return t('Closed Tickets')
		case TICKET_TYPE.ONGOING_TICKET:
			return t('Ongoing tickets')
		case TICKET_TYPE.OPEN_TICKET:
			return t('Open tickets')
		default:
			return t('Open tickets')
	}
}

export const getTicketTypeName = (type: TICKET_TYPE | CLOSED_TICKET_TYPE, t: any) => {
	switch (type) {
		case CLOSED_TICKET_TYPE.SUCCESS:
			return t('SUCCESS')
		case CLOSED_TICKET_TYPE.MISS:
			return t('MISS')
		case TICKET_TYPE.ONGOING_TICKET:
			return t('ONGOING')
		default:
			return type
	}
}

export const getUserTicketTypeName = (type: USER_TICKET_TYPE, t: any) => {
	switch (type) {
		case USER_TICKET_TYPE.SUCCESS:
			return t('SUCCESS')
		case USER_TICKET_TYPE.MISS:
			return t('MISS')
		case USER_TICKET_TYPE.PAUSED:
			return t('PAUSED')
		case USER_TICKET_TYPE.CANCELED:
			return t('CANCELED')
		case USER_TICKET_TYPE.ONGOING:
			return t('ONGOING')
		case USER_TICKET_TYPE.OPEN:
			return t('OPEN')
		default:
			return type
	}
}

export const decodeSorter = (): Sorter => {
	if (Router.router?.query.sorter && typeof Router.router?.query.sorter === 'string') {
		const [property, direction] = Router.router.query.sorter.split(':')
		return {
			property,
			direction: direction as ORDER_DIRECTION
		}
	}
	return {
		property: undefined,
		direction: undefined
	}
}

export const setSort = (property?: string, customDirection?: ORDER_DIRECTION) => {
	const currentSorter = Router.router?.query.sorter
	let direction: ORDER_DIRECTION | undefined = ORDER_DIRECTION.ASCENDENT
	// If custom direction is set, use it instead of the current sorter direction
	if (customDirection) {
		direction = customDirection
	}
	// Check if the current sorter is already set and extract the direction
	if (currentSorter && !customDirection) {
		const [currentProperty, currentDirection] = (currentSorter as string).split(':')
		if (currentProperty === property) {
			if (currentDirection === ORDER_DIRECTION.ASCENDENT) {
				direction = ORDER_DIRECTION.DESCENDENT
			}
			if (currentDirection === ORDER_DIRECTION.DESCENDENT) {
				direction = undefined
			}
		}
	}

	Router.router?.push(
		{
			pathname: Router?.router.pathname,
			query: {
				...Router?.router.query,
				sorter: direction && property ? `${property}:${direction}` : undefined // Update the sorter query parameter or remove it if direction is empty
			}
		},
		undefined,
		{ shallow: true }
	)
}

export const getUserTicketType = (ticket: UserTicket) => {
	// Canceled paused -> staci jeden?
	const canceled = ticket?.positions?.filter((item) => item.isCanceled)

	if (canceled?.length >= 1) {
		// === ticket?.positions?.length) {
		return USER_TICKET_TYPE.CANCELED
	}

	const finished = ticket?.positions?.filter((item) => item.isResolved)
	if (finished?.length === ticket?.positions?.length) {
		if (ticket?.won) {
			return USER_TICKET_TYPE.SUCCESS
		}
		// won becomes true AFTER CLAIM
		if (ticket?.won === false) {
			const won = ticket?.positions?.filter((item) => item.claimable)
			if (won?.length === ticket?.positions?.length) {
				return USER_TICKET_TYPE.SUCCESS
			}
			return USER_TICKET_TYPE.MISS
		}
		// its single ticket
		if (ticket?.positions[0]?.claimable) {
			return USER_TICKET_TYPE.SUCCESS
		}
		return USER_TICKET_TYPE.MISS
	}
	if (finished?.length > 0) {
		const lossMatch = finished?.filter((item) => !item?.claimable)
		if (lossMatch?.length !== 0) return USER_TICKET_TYPE.MISS
	}

	const paused = ticket?.positions?.filter((item) => item.isPaused)

	if (paused?.length === ticket?.positions?.length) {
		return USER_TICKET_TYPE.PAUSED
	}

	const ongoing = ticket?.positions?.find((item) => !item.isResolved && !item.isCanceled && !item.isOpen)

	const now = dayjs()
	const playingRightNow = ticket?.positions.filter((item) => {
		const maturityDate = dayjs(Number(item.market.maturityDate) * 1000)
		if (maturityDate.isAfter(now)) return false
		return true
	})

	if (ongoing || playingRightNow.length !== 0) {
		return USER_TICKET_TYPE.ONGOING
	}

	return USER_TICKET_TYPE.OPEN
}

export const ticketTypeToWalletType = (type: USER_TICKET_TYPE) => {
	switch (type) {
		case USER_TICKET_TYPE.MISS:
			return WALLET_TICKETS.MISSED
		case USER_TICKET_TYPE.ONGOING:
			return WALLET_TICKETS.ONGOING
		case USER_TICKET_TYPE.OPEN:
			return WALLET_TICKETS.OPEN_TICKETS
		case USER_TICKET_TYPE.SUCCESS:
			return WALLET_TICKETS.SUCCESSFUL
		default:
			return WALLET_TICKETS.PAUSED_CANCELED
	}
}

export const isWindowReady = () => {
	return typeof window !== 'undefined'
}

export const getReward = (index: number | undefined, chainId: number | undefined) => {
	if (!index && index !== 0) {
		return undefined
	}

	if (getCurrentBiweeklyPeriod() >= PARLAY_LEADERBOARD_FIRST_PERIOD_TOP_10_REWARDS) {
		if (index >= 10) return undefined
		if (chainId === NETWORK_IDS.ARBITRUM) {
			return { value: PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_10[index], iconUrl: ArbitrumIcon }
		}
		return { value: PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_10[index], iconUrl: OptimismIcon }
	}

	if (index >= 20) return undefined

	if (chainId === NETWORK_IDS.ARBITRUM) {
		return { value: PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20[index], iconUrl: ArbitrumIcon }
	}

	return { value: PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20[index], iconUrl: OptimismIcon }
}

export const getParlayItemStatus = (position: Position, isPlayedNow: boolean, t: any) => {
	const date = dayjs(toNumber(position.market.maturityDate) * 1000).format('MMM DD | HH:mm')
	if (isPlayedNow) {
		return { status: MATCH_STATUS.ONGOING, text: t('Playing now') }
	}
	if (position.market.isCanceled) return { status: MATCH_STATUS.CANCELED, text: t('Canceled {{ date }}', { date }), date }
	if (position.market.isPaused) return { status: MATCH_STATUS.PAUSED, text: t('Paused {{ date }}', { date }), date }
	if (position.market.isResolved) {
		let result = ''
		if (position.market?.tags && position.market?.tags && TOTAL_WINNER_TAGS.includes(position.market.tags?.[0])) {
			if (position.market.homeScore === RESULT_TYPE.WINNER) {
				result = t('Winner')
			} else {
				result = t('No win')
			}
		} else {
			result = `${position.market.homeScore || '?'} : ${position.market.awayScore || '?'}`
		}
		if (position.claimable) return { status: MATCH_STATUS.SUCCESS, text: t('Success {{ date }} ({{ result }})', { date, result }), date, result }
		return { status: MATCH_STATUS.MISS, text: t('Miss {{ date }} ({{ result }})', { date, result }), date, result }
	}
	return { status: MATCH_STATUS.OPEN, text: dayjs(toNumber(position.market.maturityDate) * 1000).format('MMM DD | HH:mm'), date }
}

export const getMatchStatus = (match: any, t: any) => {
	const date = dayjs(toNumber(match?.maturityDate) * 1000).format('| MMM DD')
	if (match.isOpen && !match.isPaused && !match.homeOdds && !match.awayOdds) return { status: MATCH_STATUS.ONGOING, text: t('Playing now') }
	if (match?.isCanceled) return { status: MATCH_STATUS.CANCELED, text: t('Canceled {{ date }}', { date }) }
	if (match?.isPaused) return { status: MATCH_STATUS.PAUSED, text: t('Paused {{ date }}', { date }) }
	if (match.isResolved) return { status: MATCH_STATUS.SUCCESS, text: `Match end | ${match.homeScore || '?'} : ${match.awayScore || '?'}` }
	return { status: MATCH_STATUS.OPEN, text: dayjs(toNumber(match?.maturityDate) * 1000).format('MMM DD | HH:mm') }
}

export const getOddsBySide = (ticket: ITicket) => {
	const { side, market } = ticket.position || ticket.positions[0]
	if (side === PositionType.Home) return market.homeOdds
	if (side === PositionType.Away) return market.awayOdds
	if (side === PositionType.Draw) return market.drawOdds
	return undefined
}

export const getTicketTotalQuote = (ticket: ITicket, oddType: OddsType, totalQuote?: any) => {
	if (totalQuote) {
		return formatQuote(oddType, totalQuote ? bigNumberFormatter(totalQuote) : 0)
	}

	const odds = getOddsBySide(ticket)
	if (odds) {
		return formatQuote(oddType, bigNumberFormatter(odds))
	}

	return 0
}

export const getPositions = (data: ParlayMarket | PositionBalance): Array<Position> => {
	let positions = [] as Array<Position>
	if (MARKET_PROPERTY.POSITIONS in data) {
		positions = data.positions
	}
	if (MARKET_PROPERTY.POSITION in data) {
		positions.push(data.position)
	}
	return positions
}

export const addDaysToEnteredTimestamp = (numberOfDays: number, timestamp: string) => {
	return new Date().setTime(new Date(timestamp).getTime() + numberOfDays * 24 * 60 * 60 * 1000)
}

export const isTicketSuccess = (market: ParlayMarket | PositionBalance) => {
	const positions = getPositions(market)
	const resolvedMarkets = positions.filter((position) => position.market?.isResolved || position.market?.isCanceled)
	const claimablePositions = positions.filter((position) => position.claimable)

	if (MARKET_PROPERTY.WON in market && market.won === true) {
		return true
	}

	return resolvedMarkets && resolvedMarkets?.length === claimablePositions?.length && resolvedMarkets?.length === positions.length
}

export const isTicketCancelled = (market: ParlayMarket | PositionBalance) => {
	const positions = getPositions(market)

	const canceledMarkets = positions.filter((position) => position.market?.isCanceled)

	if (canceledMarkets.length >= 1) return true

	return false
}

export const isTicketOpen = (market: ParlayMarket | PositionBalance) => {
	const positions = getPositions(market)
	const opened = positions.filter((position) => position.market?.isOpen)

	const now = dayjs()
	const playingRightNow = positions.filter((item) => {
		const maturityDate = dayjs(Number(item.market.maturityDate) * 1000)
		if (maturityDate.isAfter(now)) return false
		return true
	})

	return positions?.length === opened?.length && playingRightNow.length === 0
}

export const isTicketClosed = (market: ParlayMarket | PositionBalance) => {
	const positions = getPositions(market)
	const resolvedMarkets = positions.filter((position) => position.market?.isResolved || position.market?.isCanceled)

	return resolvedMarkets?.length === positions.length
}

export const getMatchResult = (match: SportMarket) => {
	if (match.finalResult === '0') return undefined
	if (match.finalResult === '1') return MATCH_RESULT.HOME
	if (match.finalResult === '2') return MATCH_RESULT.AWAY
	if (match.finalResult === '3') return MATCH_RESULT.DRAW
	return undefined
}
export const getTicketType = (market: ParlayMarket | PositionBalance): TICKET_TYPE | undefined => {
	if (isTicketOpen(market)) return TICKET_TYPE.OPEN_TICKET
	if (isTicketClosed(market)) return TICKET_TYPE.CLOSED_TICKET
	return TICKET_TYPE.ONGOING_TICKET
}

export const getClosedTicketType = (market: ParlayMarket | PositionBalance): CLOSED_TICKET_TYPE | undefined => {
	if (isTicketClosed(market)) {
		if (isTicketSuccess(market)) {
			return CLOSED_TICKET_TYPE.SUCCESS
		}
		if (isTicketCancelled(market)) {
			return CLOSED_TICKET_TYPE.CANCELLED
		}
		return CLOSED_TICKET_TYPE.MISS
	}

	return undefined
}

export const hashStringToNumber = (str: string) => {
	const arr = str.split('')
	// eslint-disable-next-line no-return-assign, no-param-reassign, no-bitwise
	return arr.reduce((hashCode: any, currentVal: any) => (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode), 0)
}

export const getEtherScanTxHash = (chainId: number, txHash: string) => {
	switch (chainId) {
		case NETWORK_IDS.OPTIMISM_GOERLI:
			return ETHERSCAN_TX_URL_OPTIMISM_GOERLI + txHash
		case NETWORK_IDS.ARBITRUM:
			return ETHERSCAN_TX_URL_ARBITRUM + txHash
		case NETWORK_IDS.OPTIMISM:
			return ETHERSCAN_TX_URL_OPTIMISM + txHash
		default:
			return undefined
	}
}

export const updateUnsubmittedTicketMatches = (
	matches: TicketPosition[] | undefined,
	unsubmittedTickets: IUnsubmittedBetTicket[] | null,
	dispatch: Dispatch<AnyAction>,
	activeTicketID?: number
) => {
	// TODO: copied does not work if user switching between ticket that is copied and then modified by match and switched in tab (corner case will be fixed in separated TASK)
	const data = unsubmittedTickets?.map((ticket) => {
		if (ticket.id === activeTicketID) {
			return {
				...ticket,
				matches,
				copied: false
			}
		}
		return { ...ticket }
	})
	dispatch({
		type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
		payload: { data }
	})
}

export const copyTicketToUnsubmittedTickets = (
	matches: TicketPosition[] | undefined,
	unsubmittedTickets: IUnsubmittedBetTicket[] | null,
	dispatch: Dispatch<AnyAction>,
	activeTicketID?: number
) => {
	const data = unsubmittedTickets?.map((ticket) => {
		if (ticket.id === activeTicketID) {
			return {
				...ticket,
				matches,
				copied: true
			}
		}
		return { ...ticket }
	})
	dispatch({
		type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
		payload: { data }
	})
}

export const getDoubleChanceAddress = (doubleChanceTypeMatches: SportMarketInfo[] | undefined, betOption: BET_OPTIONS) => {
	if (!doubleChanceTypeMatches) return 'ERROR in getDoubleChanceAddress() function'

	if (betOption === BET_OPTIONS.DOUBLE_CHANCE_HOME) {
		return doubleChanceTypeMatches.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)?.address
	}
	if (betOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY) {
		return doubleChanceTypeMatches.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)?.address
	}
	if (betOption === BET_OPTIONS.DOUBLE_CHANCE_DRAW) {
		return doubleChanceTypeMatches.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.address
	}
	return 'ERROR in getDoubleChanceAddress() function'
}

export const getBetOptionFromMatchBetOption = (matchBetOption: BET_OPTIONS): 0 | 1 | 2 | string => {
	// BetOptions Total (U / O)
	if (matchBetOption === BET_OPTIONS.TOTAL_OVER || matchBetOption === BET_OPTIONS.TOTAL_UNDER) {
		if (matchBetOption === BET_OPTIONS.TOTAL_OVER) {
			return 0
		}
		return 1
	}
	// Handicap (H1 / H2)
	if (matchBetOption === BET_OPTIONS.HANDICAP_HOME || matchBetOption === BET_OPTIONS.HANDICAP_AWAY) {
		if (matchBetOption === BET_OPTIONS.HANDICAP_HOME) {
			return 0
		}
		return 1
	}

	// Winner (1 / 2 / X)
	if (matchBetOption === BET_OPTIONS.WINNER_HOME || matchBetOption === BET_OPTIONS.WINNER_AWAY || matchBetOption === BET_OPTIONS.WINNER_DRAW) {
		if (matchBetOption === BET_OPTIONS.WINNER_DRAW) {
			return 2
		}
		if (matchBetOption === BET_OPTIONS.WINNER_AWAY) {
			return 1
		}
		return 0
	}
	// Double chances (X1, X2, 12)
	if (
		matchBetOption === BET_OPTIONS.DOUBLE_CHANCE_HOME ||
		matchBetOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY ||
		matchBetOption === BET_OPTIONS.DOUBLE_CHANCE_DRAW
	) {
		return 0
	}
	return 'ERROR in getBetOptionFromMatchBetOption() function'
}

export const getBetOptionAndAddressFromMatch = (matches: TicketPosition[] | undefined) => {
	const result: { addresses: any[]; betTypes: any[] } = {
		addresses: [],
		betTypes: []
	}

	if (!matches) {
		return result
	}

	matches.forEach((match) => {
		// NOTE: OR || vetva su kvoli tomu ak sa skpiruje tiket tak on nema nastavene spreadTypeMatch, doubleChanceTypeMatches, winnerTypeMatch
		// BetOptions Total (U / O)
		if (match.betOption === BET_OPTIONS.TOTAL_OVER || match.betOption === BET_OPTIONS.TOTAL_UNDER) {
			result.addresses.push((match.totalTypeMatch?.address as string) || match.address)
			result.betTypes.push(getBetOptionFromMatchBetOption(match.betOption))
		}
		// Handicap (H1 / H2)
		else if (match.betOption === BET_OPTIONS.HANDICAP_HOME || match.betOption === BET_OPTIONS.HANDICAP_AWAY) {
			result.addresses.push((match.spreadTypeMatch?.address as string) || match.address)
			result.betTypes.push(getBetOptionFromMatchBetOption(match.betOption))
		}
		// Double chances (X1, X2, 12)
		else if (
			match.betOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY ||
			match.betOption === BET_OPTIONS.DOUBLE_CHANCE_HOME ||
			match.betOption === BET_OPTIONS.DOUBLE_CHANCE_DRAW
		) {
			result.addresses.push(match.doubleChanceTypeMatches ? getDoubleChanceAddress(match.doubleChanceTypeMatches, match.betOption) : match.address)
			result.betTypes.push(getBetOptionFromMatchBetOption(match.betOption))
		}
		// Combined (1&O, 1&U, 2&O, 2&U)
		else if (
			match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER ||
			match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER ||
			match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER ||
			match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER
		) {
			result.addresses.push(match.winnerTypeMatch?.address, match.totalTypeMatch?.address)
			if (match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER) {
				result.betTypes.push(0, 0)
			} else if (match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER) {
				result.betTypes.push(0, 1)
			} else if (match.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER) {
				result.betTypes.push(1, 0)
			} else {
				result.betTypes.push(1, 1)
			}
		}
		// Winner (1 / 2 / X)
		else if (match.betType === null) {
			result.addresses.push((match.winnerTypeMatch?.address as string) || match.address)
			result.betTypes.push(getBetOptionFromMatchBetOption(match.betOption))
		}
		// Default state pre lepsi debug ak by nastala chyba
		return 'ERROR in getBetOptionAndAddressFromMatch() function'
	})
	return result
}

export const isClaimableUntil = (date: number) => {
	let dateDiff = date
	const days = Math.floor(date / 1440)
	if (days) {
		dateDiff -= days * 1440
	}

	const hours = Math.floor(dateDiff / 60)

	if (hours) {
		dateDiff -= hours * 60
	}

	if (days) {
		return `${days}d:${hours}h:${dateDiff}m`
	}

	if (hours) {
		return `${hours}h:${dateDiff}m`
	}
	return `${dateDiff}m`
}
export const isCombined = (betOption: any) => {
	return Object.values(COMBINED_BET_OPTIONS).includes(betOption)
}

export const orderPositionsAsSportMarkets = (ticket: UserTicket | ITicket) => {
	if (ticket.positions.length === 1) return ticket.positions

	if (!ticket.sportMarkets) return ticket.positions

	const orderedPositions = ticket.sportMarkets.map((item) => {
		// def has positions if conditions above are correct.
		// @ts-ignore
		return ticket.positions.find((position) => position.market.gameId === item.gameId && item.address === position.market.address)
	})

	return orderedPositions
}

export const getHandicapValue = (number: number, type: BET_OPTIONS.HANDICAP_AWAY | BET_OPTIONS.HANDICAP_HOME) => {
	const oppositeNumber = -number
	const prefix = oppositeNumber >= 0 ? '+' : '-'
	if (type === BET_OPTIONS.HANDICAP_HOME) {
		return `${roundToTwoDecimals(number)}`
	}
	return prefix + roundToTwoDecimals(Math.abs(oppositeNumber))
}

export const markedValue = (value: string) => {
	const prefix = Number(value) >= 0 ? `+${value}` : value
	return prefix
}

export const checkTotalWinnerBetExist = (activeTicketValues: IUnsubmittedBetTicket, match: any) => {
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(match?.winnerTypeMatch?.tags[0] as any)
	// NOTE: ak obsahuje tiket uz totalWinnera z danej sutaze a pridavame z tej istej sutaze dalsieho tak vyhodi warning
	const hasTotalWinnerMatch = activeTicketValues?.matches?.some((item) => item.id === match.id)
	const hasTotalWinnerTag = activeTicketValues?.matches?.some((item) => item.tags && item.tags.includes(match.winnerTypeMatch?.tags[0] as any))
	if (isTotalWinner && hasTotalWinnerTag && !hasTotalWinnerMatch) {
		return true
	}
	return false
}
export const checkTeamExistInBet = (matches: TicketPosition[], match: TicketPosition) => {
	for (let i = 0; i < matches.length; i += 1) {
		if (matches[i].homeTeam === match.homeTeam) {
			return matches[i].homeTeam
		}
		if (matches[i].awayTeam === match.awayTeam) {
			return matches[i].awayTeam
		}
	}
	return false
}

export const getCanceledClaimAmount = (ticket: UserTicket) => {
	// parlay
	if (ticket.quote) {
		let totalAmount = Number(ticket.amount) / OPTIMISM_DIVISOR

		ticket.sportMarketsFromContract?.forEach((address, index) => {
			const market = ticket.sportMarkets?.find((market) => market.address === address)
			if (market && market.isCanceled && ticket?.marketQuotes?.[index]) {
				totalAmount *= Number(ticket.marketQuotes[index]) / OPTIMISM_DIVISOR
			}
		})

		return floor(totalAmount, 2).toFixed(2)
	}

	// single ticket
	let claimAmount = 0
	const match = ticket.positions[0]
	if (match.isResolved && match.isCanceled) {
		const match = ticket.positions[0]
		switch (match.side) {
			case PositionType.Away: {
				claimAmount += (Number(match.market.homeOdds) / OPTIMISM_DIVISOR) * (ticket.amount / OPTIMISM_DIVISOR)
				break
			}
			case PositionType.Draw: {
				claimAmount += match.market.drawOdds ? (Number(match.market.drawOdds) / OPTIMISM_DIVISOR) * (ticket.amount / OPTIMISM_DIVISOR) : 0
				break
			}

			case PositionType.Home: {
				claimAmount += (Number(match.market.homeOdds) / OPTIMISM_DIVISOR) * (ticket.amount / OPTIMISM_DIVISOR)
				break
			}
			default:
				claimAmount += 0
		}
	}
	return floor(claimAmount, 2).toFixed(2)
}

export const convertSGPContractDataToSGPItemType = (sgpContractData: SGPContractData): SGPItem[] => {
	const finalSGPItems: SGPItem[] = []

	sgpContractData.forEach((item) => {
		const sgpFees = [item[1], item[2], item[3]]
		sgpFees.forEach((sgpContractItem, sgpIndex) => {
			if (bigNumberFormmaterWithDecimals(sgpContractItem.toString()) !== 0) {
				const marketTypeCombination = SGPCombinationsFromContractOrderMapping[sgpIndex as ContractSGPOrder]
				finalSGPItems.push({
					tags: [Number(item[0])],
					combination: marketTypeCombination,
					SGPFee: bigNumberFormmaterWithDecimals(sgpContractItem.toString())
				})
			}
		})
	})

	return finalSGPItems
}

export const getSelectedCoinIndex = (selectedCoin?: string): number => {
	switch (selectedCoin) {
		case STABLE_COIN.S_USD:
			return 0
		case STABLE_COIN.DAI:
			return 1
		case STABLE_COIN.USDC:
			return 2
		case STABLE_COIN.USDT:
			return 3
		default:
			throw new Error('Invalid stable coin')
	}
}

export const getOddByBetType = (market: IMatch, copied: boolean, oddType: OddsType, customBetOption?: BET_OPTIONS) => {
	// customBetOption is used for override match betOption (using in MatchListContent where we need to return odds based on type of odds in dropdown)
	// TODO: add logic for bonuses or create new function for bonuses
	const betOption = customBetOption || market.betOption

	switch (betOption) {
		// 1, 2, X
		case BET_OPTIONS.WINNER_HOME:
			return {
				formattedOdd: formatQuote(oddType, market.homeOdds),
				rawOdd: market.homeOdds,
				formattedBonus: getFormattedBonus(market.homeBonus),
				rawBonus: (market.homeBonus || 0) > 0 ? market.homeBonus || 0 : 0
			}
		case BET_OPTIONS.WINNER_AWAY:
			return {
				formattedOdd: formatQuote(oddType, market.awayOdds),
				rawOdd: market.awayOdds,
				formattedBonus: getFormattedBonus(market.awayBonus),
				rawBonus: (market.awayBonus || 0) > 0 ? market.awayBonus || 0 : 0
			}
		case BET_OPTIONS.WINNER_DRAW:
			return {
				formattedOdd: formatQuote(oddType, market.drawOdds),
				rawOdd: market.drawOdds,
				formattedBonus: getFormattedBonus(market.drawBonus),
				rawBonus: (market.drawBonus || 0) > 0 ? market.drawBonus || 0 : 0
			}
		// H1, H2
		case BET_OPTIONS.HANDICAP_HOME:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: (market.homeBonus || 0) > 0 ? market.homeBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(oddType, market.spreadTypeMatch?.homeOdds),
						rawOdd: market.spreadTypeMatch?.homeOdds,
						formattedBonus: getFormattedBonus(market.spreadTypeMatch?.homeBonus),
						rawBonus: (market.spreadTypeMatch?.homeBonus || 0) > 0 ? market.spreadTypeMatch?.homeBonus || 0 : 0
				  }
		case BET_OPTIONS.HANDICAP_AWAY:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: (market.awayBonus || 0) > 0 ? market.awayBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(oddType, market.spreadTypeMatch?.awayOdds),
						rawOdd: market.spreadTypeMatch?.awayOdds,
						formattedBonus: getFormattedBonus(market.spreadTypeMatch?.awayBonus),
						rawBonus: (market.spreadTypeMatch?.awayBonus || 0) > 0 ? market.spreadTypeMatch?.awayBonus || 0 : 0
				  }
		// O, U
		case BET_OPTIONS.TOTAL_OVER:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: (market.homeBonus || 0) > 0 ? market.homeBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(oddType, market.totalTypeMatch?.homeOdds),
						rawOdd: market.totalTypeMatch?.homeOdds,
						formattedBonus: getFormattedBonus(market.totalTypeMatch?.homeBonus),
						rawBonus: (market.totalTypeMatch?.homeBonus || 0) > 0 ? market.totalTypeMatch?.homeBonus || 0 : 0
				  }
		case BET_OPTIONS.TOTAL_UNDER:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: (market.awayBonus || 0) > 0 ? market.awayBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(oddType, market.totalTypeMatch?.awayOdds),
						rawOdd: market.totalTypeMatch?.awayOdds,
						formattedBonus: getFormattedBonus(market.totalTypeMatch?.awayBonus),
						rawBonus: (market.totalTypeMatch?.awayBonus || 0) > 0 ? market.totalTypeMatch?.awayBonus || 0 : 0
				  }
		// X1, X2, 12
		case BET_OPTIONS.DOUBLE_CHANCE_HOME:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: (market.homeBonus || 0) > 0 ? market.homeBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(
							oddType,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
							?.homeOdds,
						rawBonus:
							(market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0) > 0
								? market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
										?.homeBonus || 0
								: 0,
						formattedBonus: getFormattedBonus(
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0
						)
				  }
		case BET_OPTIONS.DOUBLE_CHANCE_AWAY:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: (market.awayBonus || 0) > 0 ? market.awayBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(
							oddType,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
							?.homeOdds,
						rawBonus:
							(market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0) > 0
								? market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
										?.homeBonus || 0
								: 0,
						formattedBonus: getFormattedBonus(
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0
						)
				  }
		case BET_OPTIONS.DOUBLE_CHANCE_DRAW:
			return copied
				? {
						formattedOdd: formatQuote(oddType, market.drawOdds),
						rawOdd: market.drawOdds,
						formattedBonus: getFormattedBonus(market.drawBonus),
						rawBonus: (market.drawBonus || 0) > 0 ? market.drawBonus || 0 : 0
				  }
				: {
						formattedOdd: formatQuote(
							oddType,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeOdds,
						rawBonus:
							(market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeBonus || 0) >
							0
								? market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeBonus ||
								  0
								: 0,
						formattedBonus: getFormattedBonus(
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeBonus || 0
						)
				  }
		// 1&O, 1&U, 2&O, 2&U
		case BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER:
		case BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER:
		case BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER:
		case BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER:
			return {
				// TODO: combined match bet options not work for AMERICAN  / AMM quote type
				formattedOdd: formattedCombinedTypeMatch(market, oddType, betOption).formattedOdd,
				rawOdd: formattedCombinedTypeMatch(market, oddType, betOption).rawOdd,
				formattedBonus: 0, // NOTE: combined markets don't have bonus
				rawBonus: 0
			}
		default:
			return {
				formattedOdd: 0,
				rawOdd: 0,
				formattedBonus: 0,
				rawBonus: 0
			}
	}
}
export const isAboveOrEqualResolution = (currentResolution: RESOLUTIONS, resolution: RESOLUTIONS) => {
	switch (resolution) {
		case RESOLUTIONS.XXL:
			if (currentResolution === RESOLUTIONS.XXL) return true
			return false
		case RESOLUTIONS.SEMIXXL:
			if (currentResolution === RESOLUTIONS.SEMIXXL || currentResolution === RESOLUTIONS.XXL) return true
			return false
		case RESOLUTIONS.XL:
			if (currentResolution === RESOLUTIONS.XXL || currentResolution === RESOLUTIONS.SEMIXXL || currentResolution === RESOLUTIONS.XL) return true
			return false
		case RESOLUTIONS.LG:
			if (
				currentResolution === RESOLUTIONS.XXL ||
				currentResolution === RESOLUTIONS.SEMIXXL ||
				currentResolution === RESOLUTIONS.XL ||
				currentResolution === RESOLUTIONS.LG
			)
				return true
			return false
		case RESOLUTIONS.MD:
			if (
				currentResolution === RESOLUTIONS.XXL ||
				currentResolution === RESOLUTIONS.SEMIXXL ||
				currentResolution === RESOLUTIONS.XL ||
				currentResolution === RESOLUTIONS.LG ||
				currentResolution === RESOLUTIONS.MD
			)
				return true
			return false
		case RESOLUTIONS.SMSX:
			if (
				currentResolution === RESOLUTIONS.XXL ||
				currentResolution === RESOLUTIONS.SEMIXXL ||
				currentResolution === RESOLUTIONS.XL ||
				currentResolution === RESOLUTIONS.LG ||
				currentResolution === RESOLUTIONS.MD ||
				currentResolution === RESOLUTIONS.SMSX
			)
				return true
			return false
		case RESOLUTIONS.SM:
		default:
			return true
	}
}

export const isBellowOrEqualResolution = (currentResolution: RESOLUTIONS, resolution: RESOLUTIONS) => {
	switch (resolution) {
		case RESOLUTIONS.SM:
			if (currentResolution === RESOLUTIONS.SM) return true
			return false
		case RESOLUTIONS.SMSX:
			if (currentResolution === RESOLUTIONS.SM || currentResolution === RESOLUTIONS.SMSX) return true
			return false
		case RESOLUTIONS.MD:
			if (currentResolution === RESOLUTIONS.SM || currentResolution === RESOLUTIONS.MD || currentResolution === RESOLUTIONS.SMSX) return true
			return false
		case RESOLUTIONS.LG:
			if (
				currentResolution === RESOLUTIONS.SMSX ||
				currentResolution === RESOLUTIONS.SM ||
				currentResolution === RESOLUTIONS.MD ||
				currentResolution === RESOLUTIONS.LG
			)
				return true
			return false
		case RESOLUTIONS.XL:
			if (
				currentResolution === RESOLUTIONS.SM ||
				currentResolution === RESOLUTIONS.SMSX ||
				currentResolution === RESOLUTIONS.MD ||
				currentResolution === RESOLUTIONS.LG ||
				currentResolution === RESOLUTIONS.XL
			)
				return true
			return false
		case RESOLUTIONS.SEMIXXL:
			if (
				currentResolution === RESOLUTIONS.SM ||
				currentResolution === RESOLUTIONS.SMSX ||
				currentResolution === RESOLUTIONS.MD ||
				currentResolution === RESOLUTIONS.LG ||
				currentResolution === RESOLUTIONS.XL ||
				currentResolution === RESOLUTIONS.SEMIXXL
			)
				return true
			return false
		case RESOLUTIONS.XXL:
		default:
			return true
	}
}
export const getCollateral = (networkId: Network, index: number) => COLLATERALS[networkId][index]

export const getStablecoinDecimals = (networkId: Network, stableIndex: number) => STABLE_DECIMALS[getCollateral(networkId, stableIndex)]

export const getCombinedPositionText = (positions: Position[]): CombinedMarketsPositionName | null => {
	const firstPositionBetType = Number(positions[0]?.market?.betType) as BetType
	const secondPositionBetType = Number(positions[1]?.market?.betType) as BetType

	const firstPositionSide = convertPositionNameToPosition(positions[0]?.side)
	const secondPositionSide = convertPositionNameToPosition(positions[1].side)

	if (firstPositionBetType === BetType.WINNER && secondPositionBetType === BetType.TOTAL) {
		if (firstPositionSide === 0 && secondPositionSide === 0) return '1&O'
		if (firstPositionSide === 0 && secondPositionSide === 1) return '1&U'
		if (firstPositionSide === 1 && secondPositionSide === 0) return '2&O'
		if (firstPositionSide === 1 && secondPositionSide === 1) return '2&U'
		if (firstPositionSide === 2 && secondPositionSide === 0) return 'X&O'
		if (firstPositionSide === 2 && secondPositionSide === 1) return 'X&U'
	}
	// NOTE: might be ordered differently
	if (secondPositionBetType === BetType.WINNER && firstPositionBetType === BetType.TOTAL) {
		if (secondPositionSide === 0 && firstPositionSide === 0) return '1&O'
		if (secondPositionSide === 0 && firstPositionSide === 1) return '1&U'
		if (secondPositionSide === 1 && firstPositionSide === 0) return '2&O'
		if (secondPositionSide === 1 && firstPositionSide === 1) return '2&U'
		if (secondPositionSide === 2 && firstPositionSide === 0) return 'X&O'
		if (secondPositionSide === 2 && firstPositionSide === 1) return 'X&U'
	}

	if (firstPositionBetType === BetType.SPREAD && secondPositionBetType === BetType.TOTAL) {
		if (firstPositionSide === 0 && secondPositionSide === 0) return 'H1&O'
		if (firstPositionSide === 0 && secondPositionSide === 1) return 'H1&U'
		if (firstPositionSide === 1 && secondPositionSide === 0) return 'H2&O'
		if (firstPositionSide === 1 && secondPositionSide === 1) return 'H2&U'
	}

	if (secondPositionBetType === BetType.SPREAD && firstPositionBetType === BetType.TOTAL) {
		if (secondPositionSide === 0 && firstPositionSide === 0) return 'H1&O'
		if (secondPositionSide === 0 && firstPositionSide === 1) return 'H1&U'
		if (secondPositionSide === 1 && firstPositionSide === 0) return 'H2&O'
		if (secondPositionSide === 1 && firstPositionSide === 1) return 'H2&U'
	}

	return null
}

type PositionWithIndex = {
	index: number
} & Position

export const getCombinedPositionsOdds = (positions: PositionWithIndex[], ticket: UserTicket | ITicket, sgpFees: SGPItem[] | undefined) => {
	const firstPositionOdds = Number(formatParlayQuote(Number(ticket?.marketQuotes?.[positions[0]?.index])))
	const secondPositionOdds = Number(formatParlayQuote(Number(ticket?.marketQuotes?.[positions[1]?.index])))

	const combinedOdds = firstPositionOdds * secondPositionOdds

	if (!sgpFees) {
		return floor(combinedOdds, 2).toFixed(2)
	}

	let sgpItem: undefined | SGPItem

	sgpFees.forEach((item) => {
		if (item.tags.every((value, index) => value === Number(positions[0]?.market?.tags?.[index]))) {
			if (item.combination.includes(Number(positions[0].market.betType)) && item.combination.includes(Number(positions[1].market.betType))) {
				sgpItem = item
			}
		}
	})

	if (!sgpItem) {
		return floor(combinedOdds, 2).toFixed(2)
	}

	// TODO: totalquote wont match this quote. Same on Overtime

	const afterSGPFee = Number(combinedOdds) * sgpItem.SGPFee

	return floor(afterSGPFee, 2).toFixed(2)
}

export const getPositionsWithMergedCombinedPositions = (positions: Position[], ticket: UserTicket | ITicket, sgpFees: SGPItem[] | undefined) => {
	const positionsWithIndex = positions?.map((position, index) => {
		return {
			...position,
			index
		}
	})

	const groupedPositions = toPairs(
		groupBy(positionsWithIndex, (position) => {
			return position.market.gameId
		})
	)

	const newPositions: PositionWithCombinedAttrs[] = []

	groupedPositions.forEach((item) => {
		const positions = item?.[1]
		if (positions?.length === 1) {
			newPositions.push(positions[0])
		} else {
			// NOTE: 2 positions => combined
			const newPosition = {
				...positions[0], // NOTE: its id/marketaddress ... wont be used anymore.
				combinedPositionsText: getCombinedPositionText(positions),
				odds: getCombinedPositionsOdds(positions, ticket, sgpFees),
				isCombined: true,
				claimable: !(!positions[0].claimable || !positions[1].claimable),
				market: {
					...positions[0].market
				}
			}
			newPositions.push(newPosition as any)
		}
	})

	return newPositions
}

export const removeDuplicateSubstring = (inputString: string): string => {
	// Split the input string into words
	const words = inputString.split(' ')
	// Set<string> means unique collection of strings (similar to array)
	const uniqueWords = words.reduce((acc: Set<string>, word: string) => {
		if (!acc.has(word)) {
			acc.add(word)
		}
		return acc
	}, new Set<string>())
	// Convert Set to Array and join the unique words
	return Array.from(uniqueWords).join(' ')
}

export const removeDuplicatesByGameId = (positions: Position[]): number => {
	const uniqueGameIds = positions.reduce((gameIds: Set<string>, position: Position) => {
		const { gameId } = position.market
		gameIds.add(gameId)
		return gameIds
	}, new Set<string>())

	return uniqueGameIds.size
}

export const parsePositionBalanceToUserTicket = (ticket: PositionBalance): UserTicket => {
	const newTicket = {
		id: ticket?.id,
		won: undefined,
		claimed: ticket?.claimed,
		sUSDPaid: Number(ticket?.sUSDPaid),
		txHash: ticket?.firstTxHash,
		amount: Number(ticket?.amount),
		ticketType: WALLET_TICKETS.ALL,
		maturityDate: Number(ticket?.position?.market?.maturityDate),
		isClaimable: false,
		timestamp: 0,
		account: ticket?.account,
		positions: [
			{
				// some are moved up so its easier to work with them
				id: ticket?.id,
				side: ticket?.position?.side,
				claimable: ticket?.position?.claimable,
				isCanceled: ticket?.position?.market?.isCanceled,
				isOpen: ticket?.position?.market?.isOpen,
				isPaused: ticket?.position?.market?.isPaused,
				isResolved: ticket?.position?.market?.isResolved,
				marketAddress: ticket?.position?.market?.address,
				maturityDate: Number(ticket?.position?.market?.maturityDate),
				market: {
					...ticket.position.market,
					homeTeam: removeDuplicateSubstring(ticket?.position?.market?.homeTeam),
					awayTeam: removeDuplicateSubstring(ticket?.position?.market?.awayTeam)
				}
			}
		]
	}

	return newTicket as UserTicket
}

export const parseParlayToUserTicket = (ticket: ParlayMarket): UserTicket => {
	const newTicket = {
		id: ticket?.id,
		won: ticket?.won,
		claimed: ticket?.claimed,
		sUSDPaid: Number(ticket?.sUSDPaid),
		txHash: ticket?.txHash,
		quote: ticket?.totalQuote,
		amount: Number(ticket?.totalAmount),
		marketQuotes: ticket?.marketQuotes,
		maturityDate: 0,
		ticketType: WALLET_TICKETS.ALL,
		timestamp: ticket.timestamp,
		sportMarketsFromContract: ticket.sportMarketsFromContract,
		isClaimable: false,
		account: ticket?.account,
		positions: ticket?.positions?.map((positionItem) => {
			return {
				// some are moved up so its easier to work with them
				id: positionItem.id,
				side: positionItem.side,
				claimable: positionItem?.claimable,
				isCanceled: positionItem?.market?.isCanceled,
				isOpen: positionItem?.market?.isOpen,
				isPaused: positionItem?.market?.isPaused,
				isResolved: positionItem?.market?.isResolved,
				maturityDate: Number(positionItem?.market?.maturityDate),
				marketAddress: positionItem?.market?.address,
				market: {
					...positionItem.market,
					homeTeam: removeDuplicateSubstring(positionItem?.market?.homeTeam),
					awayTeam: removeDuplicateSubstring(positionItem?.market?.awayTeam)
				}
			}
		}),
		sportMarkets: ticket?.sportMarkets?.map((item) => ({
			gameId: item.gameId,
			address: item.address,
			isCanceled: item.isCanceled
		}))
	}

	const lastMaturityDate: number = max(newTicket?.positions?.map((item) => Number(item?.maturityDate))) || 0
	newTicket.maturityDate = lastMaturityDate

	return newTicket as UserTicket
}

export const assignOtherAttrsToUserTicket = async (
	ticket: UserTicket[],
	marketTransactions: { timestamp: string; id: string }[] | undefined,
	chainId: number | undefined,
	signer: ethers.Signer | undefined
) => {
	const promises = ticket.map(async (item) => {
		const userTicketType = getUserTicketType(item as any)

		let timestamp = item?.timestamp
		if (!timestamp) {
			timestamp = marketTransactions?.find((transaction) => transaction?.id === item?.id)?.timestamp || ''
		}
		if (!(userTicketType === USER_TICKET_TYPE.SUCCESS || userTicketType === USER_TICKET_TYPE.CANCELED) || item.claimed) {
			return {
				...item,
				isClaimable: false,
				ticketType: ticketTypeToWalletType(userTicketType),
				timestamp
			}
		}

		const maturityDates = item.positions?.map((position) => {
			return { maturityDate: position?.maturityDate, id: position.marketAddress }
		})

		const lastMaturityDate = maturityDates.sort((a, b) => (a.maturityDate < b.maturityDate ? 1 : -1))[0]
		if (chainId) {
			const contract = new ethers.Contract(lastMaturityDate.id, sportsMarketContract.abi, signer)

			const contractData = await contract.times()
			const expiryDate = contractData?.expiry?.toString()
			const now = dayjs()
			return {
				...item,
				isClaimable: !now.isAfter(expiryDate * 1000),
				ticketType: ticketTypeToWalletType(userTicketType),
				timestamp
			}
		}
		return {
			...item,
			isClaimable: false,
			ticketType: ticketTypeToWalletType(userTicketType),
			timestamp
		}
	})

	return Promise.all(promises)
}

export const getTicketHistoricQuote = (positionsWithMergedCombinedPositions: PositionWithCombinedAttrs[], actualOddType: OddsType, marketQuotes?: string[]) => {
	const isParlay = positionsWithMergedCombinedPositions?.length > 1
	let quote: undefined | number
	positionsWithMergedCombinedPositions?.forEach((item, index) => {
		if (isParlay) {
			if (!quote) {
				quote = item?.isCombined ? Number(item?.odds) : Number(formatParlayQuote(Number(marketQuotes?.[index])))
			} else {
				quote *= item?.isCombined ? Number(item?.odds) : Number(formatParlayQuote(Number(marketQuotes?.[index])))
			}
		} else {
			quote = item?.isCombined ? Number(item?.odds) : Number(formatPositionOdds(item, actualOddType))
		}
	})

	return quote?.toFixed(2)
}

export const formatTicketPositionsForStatistics = (data: { parlayMarkets: ParlayMarket[]; positionBalances: PositionBalance[] }) => {
	const parlayTickets: any[] = data.parlayMarkets?.map((parlay: ParlayMarket) => {
		const newParlay = {
			id: parlay?.id,
			won: parlay?.won,
			claimed: parlay?.claimed,
			sUSDPaid: parlay?.sUSDPaid,
			txHash: parlay?.txHash,
			quote: parlay?.totalQuote,
			amount: parlay?.totalAmount,
			marketQuotes: parlay?.marketQuotes,
			maturityDate: 0,
			ticketType: WALLET_TICKETS.ALL,
			timestamp: parlay.timestamp,
			sportMarketsFromContract: parlay.sportMarketsFromContract,
			isClaimable: false,
			positions: parlay?.positions?.map((positionItem) => {
				return {
					// some are moved up so its easier to work with them
					id: positionItem.id,
					side: positionItem.side,
					claimable: positionItem?.claimable,
					isCanceled: positionItem?.market?.isCanceled,
					isOpen: positionItem?.market?.isOpen,
					isPaused: positionItem?.market?.isPaused,
					isResolved: positionItem?.market?.isResolved,
					maturityDate: Number(positionItem?.market?.maturityDate),
					marketAddress: positionItem?.market?.address,
					market: {
						...positionItem.market,
						homeTeam: removeDuplicateSubstring(positionItem?.market?.homeTeam),
						awayTeam: removeDuplicateSubstring(positionItem?.market?.awayTeam)
					}
				}
			}),
			sportMarkets: parlay?.sportMarkets?.map((item) => ({
				gameId: item.gameId,
				address: item.address,
				isCanceled: item.isCanceled
			}))
		}

		const lastMaturityDate: number = max(newParlay?.positions?.map((item) => Number(item?.maturityDate))) || 0
		newParlay.maturityDate = lastMaturityDate

		return newParlay
	})
	const positionTickets: any[] = data.positionBalances?.map((positionItem: PositionBalance) => {
		return {
			id: positionItem?.id,
			won: undefined,
			claimed: positionItem.claimed,
			sUSDPaid: positionItem?.sUSDPaid,
			txHash: positionItem?.firstTxHash,
			amount: positionItem?.amount,
			quote: null,
			ticketType: WALLET_TICKETS.ALL,
			maturityDate: Number(positionItem?.position?.market?.maturityDate),
			isClaimable: false,
			timestamp: 0,
			positions: [
				{
					// some are moved up so its easier to work with them
					id: positionItem.id,
					side: positionItem.position.side,
					claimable: positionItem?.position?.claimable,
					isCanceled: positionItem?.position?.market?.isCanceled,
					isOpen: positionItem?.position?.market?.isOpen,
					isPaused: positionItem?.position?.market?.isPaused,
					isResolved: positionItem?.position?.market?.isResolved,
					marketAddress: positionItem?.position?.market?.address,
					maturityDate: Number(positionItem?.position?.market?.maturityDate),
					market: {
						...positionItem.position?.market,
						homeTeam: removeDuplicateSubstring(positionItem?.position?.market?.homeTeam),
						awayTeam: removeDuplicateSubstring(positionItem?.position?.market?.awayTeam)
					}
				}
			]
		}
	})
	return {
		parlayTickets,
		positionTickets
	}
}

export const getUserTicketClaimValue = (ticket: UserTicket | undefined, userTicketType: USER_TICKET_TYPE | undefined) => {
	if (!ticket || !userTicketType) return '0 $'

	if (userTicketType === USER_TICKET_TYPE.MISS) return `0 $`
	if (userTicketType === USER_TICKET_TYPE.SUCCESS) return `+ ${roundPrice(ticket?.amount, true)}`
	if (userTicketType === USER_TICKET_TYPE.CANCELED) return ` + ${getCanceledClaimAmount(ticket)}`
	return roundPrice(ticket?.amount, true)
}

export const handleTxHashRedirect = (t: any, txHash?: string, chainId?: number) => {
	if (!txHash) {
		showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to redirect') }], NOTIFICATION_TYPE.NOTIFICATION)
	}

	const link = document.createElement('a')
	const newHref = getEtherScanTxHash(chainId || NETWORK_IDS.OPTIMISM, txHash || '')
	if (!newHref) {
		showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to redirect') }], NOTIFICATION_TYPE.NOTIFICATION)
		document.body.removeChild(link)
	} else {
		link.href = newHref
		link.setAttribute('target', '_blank')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}
}
