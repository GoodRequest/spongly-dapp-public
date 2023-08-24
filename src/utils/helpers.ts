import dayjs from 'dayjs'
import { notification } from 'antd'
import numbro from 'numbro'
import Router from 'next/router'

import { floor, round, toNumber } from 'lodash'
import { AnyAction, Dispatch } from 'redux'

import {
	CLOSED_TICKET_TYPE,
	COLLATERALS,
	DEFAULT_CURRENCY_DECIMALS,
	ErrorNotificationTypes,
	ETHERSCAN_TX_URL_ARBITRUM,
	ETHERSCAN_TX_URL_OPTIMISM,
	ETHERSCAN_TX_URL_OPTIMISM_GOERLI,
	LONG_CURRENCY_DECIMALS,
	MATCH_STATUS,
	MAX_GAS_LIMIT,
	MSG_TYPE,
	Network,
	NETWORK_IDS,
	OddsType,
	OPTIMISM_DIVISOR,
	ORDER_DIRECTION,
	PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_10,
	PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20,
	PARLAY_LEADERBOARD_FIRST_PERIOD_TOP_10_REWARDS,
	PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_10,
	PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20,
	PositionNumber,
	SGPCombinationsFromContractOrderMapping,
	SHORT_CURRENCY_DECIMALS,
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
	MATCHES,
	RESOLUTIONS,
	WALLET_TICKETS
} from './enums'
import { ParlayMarket, Position, PositionBalance, PositionType } from '@/__generated__/resolvers-types'

import OptimismIcon from '@/assets/icons/optimism-icon.svg'
import ArbitrumIcon from '@/assets/icons/arbitrum-icon.svg'
import { CombinedMarketsPositionName, IMatch, ITicket, SGPContractData, SGPItem, Sorter, SportMarketInfo, UserTicket } from '@/typescript/types'
import { IUnsubmittedBetTicket, TicketPosition, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'
import { NetworkId } from './networkConnector'
import { bigNumberFormatter, bigNumberFormmaterWithDecimals } from '@/utils/formatters/ethers'
import { getFormattedBonus } from '@/utils/markets'
import { BetType } from '@/utils/tags'

export const roundPrice = (price: number | undefined | null, includeDollarSign?: boolean) => {
	if (!price) {
		return 0
	}
	// TODO: OPTIMISM_DIVISOR is only for Optimism add helper getStablecoinDecimals() task: CH-315
	const roundedPrice = round(price / OPTIMISM_DIVISOR, 2).toFixed(2)
	if (!includeDollarSign) return roundedPrice
	return `${roundedPrice} $`
}

export const roundETH = (value: string) => {
	return floor(Number(value), 2).toFixed(2)
}

export const formatDateTime = (dateTime: number) => {
	if (!dateTime) {
		return '-'
	}

	return dayjs.unix(dateTime)?.format('MMM DD,YY|HH:mm')
}

export const handleErrorMessage = (errorType: ErrorNotificationTypes, t: any) => {
	let message
	if (errorType) {
		switch (errorType) {
			case ErrorNotificationTypes.TABLE: {
				message = t(`Could not load table data`)
				break
			}
			case ErrorNotificationTypes.PARLAY_LEADERBOARD: {
				message = t('Could not load parley leaderboard')
				break
			}
			default:
				message = t(`Unknown error`)
		}
	} else {
		message = t(`Unknown error`)
	}
	notification.error({
		message
	})
}

export const formatCurrency = (value: string | number, decimals: number, trimDecimals = false) => {
	if (!value || !Number(value)) {
		return 0
	}

	return numbro(value).format({
		thousandSeparated: true,
		trimMantissa: trimDecimals,
		mantissa: decimals
	})
}

const getPrecision = (amount: string | number) => {
	if (toNumber(amount) >= 1) {
		return DEFAULT_CURRENCY_DECIMALS
	}
	if (toNumber(amount) > 0.01) {
		return SHORT_CURRENCY_DECIMALS
	}
	return LONG_CURRENCY_DECIMALS
}

export const formatCurrencyWithSign = (sign: string | null | undefined, value: string | number | null | undefined, decimals?: number) => {
	if (!value) return '-'
	return `${sign} ${formatCurrency(value, decimals !== undefined ? decimals : getPrecision(value))}`
}

export const formatAddress = (address: string | undefined) => {
	if (!address) return ''

	return `${address?.slice(0, 3)}...${address?.slice(-3)}`
}

export const formatNetworkName = (networkName: string | undefined) => {
	if (!networkName) return ''

	if (networkName?.includes(' ')) {
		return networkName.split(' ')?.at(0)
	}

	return networkName
}

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
		if (lossMatch) return USER_TICKET_TYPE.MISS
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

export const getFormatDate = (type: string, date: any, t: any) => {
	if (type === MATCHES.ONGOING) return t('Playing right now')
	if (type === MATCHES.PAUSED) return `${t('Paused until')} ${dayjs(toNumber(date) * 1000).format('MMM DD | HH:mm')}`
	return dayjs(toNumber(date) * 1000).format('MMM DD | HH:mm')
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
export const formatDateWithTime = (date: Date | number) => dayjs(date, 'dd MMM HH:mm')

export const getParlayItemStatus = (position: Position, isPlayedNow: boolean, t: any) => {
	const date = dayjs(toNumber(position.market.maturityDate) * 1000).format('| MMM DD')
	if (isPlayedNow) {
		return { status: MATCH_STATUS.ONGOING, text: t('Playing now') }
	}

	if (position.market.isCanceled) return { status: MATCH_STATUS.CANCELED, text: t('Canceled {{ date }}', { date }) }
	if (position.market.isPaused) return { status: MATCH_STATUS.PAUSED, text: t('Paused {{ date }}', { date }) }
	if (position.market.isResolved) {
		if (position.claimable) return { status: MATCH_STATUS.SUCCESS, text: t('Success {{ date }}', { date }) }
		return { status: MATCH_STATUS.MISS, text: t('Miss {{ date }}', { date }) }
	}
	return { status: MATCH_STATUS.OPEN, text: dayjs(toNumber(position.market.maturityDate) * 1000).format('MMM DD | HH:mm') }
}

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

export const getOddsBySide = (ticket: ITicket) => {
	if (!ticket?.position) {
		return undefined
	}
	const { side, market } = ticket.position
	if (side === PositionType.Home) return market.homeOdds
	if (side === PositionType.Away) return market.awayOdds
	if (side === PositionType.Draw) return market.drawOdds
	return undefined
}

export const getTicketTotalQuote = (ticket: ITicket, totalQuote?: any) => {
	if (totalQuote) {
		return formatQuote(OddsType.DECIMAL, totalQuote ? bigNumberFormatter(totalQuote) : 0)
	}

	const odds = getOddsBySide(ticket)
	if (odds) {
		return formatQuote(OddsType.DECIMAL, bigNumberFormatter(odds))
	}

	return 0
}

export const formatAccount = (account: string) => {
	return account.slice(0, 3).concat('...').concat(account.slice(-3))
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

const isWinningTicket = (market: ParlayMarket | PositionBalance) => {
	if (MARKET_PROPERTY.WON in market) {
		return market.won
	}
	return market.position.claimable
}

export const getSuccessRateForTickets = (tickets: Array<ParlayMarket | PositionBalance>): string => {
	const resolvedTickets = tickets.filter((ticket) => {
		const positions = getPositions(ticket)
		return positions.every((position) => position.market.isResolved)
	})
	const winningTickets = resolvedTickets.filter((ticket) => isWinningTicket(ticket)) // pri singles je to claimable
	if (!resolvedTickets.length) return '0.00'
	return floor((winningTickets.length / resolvedTickets.length) * 100, 2).toFixed(2)
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
export const hasBonus = (bonus: number | undefined) => Number(bonus) > 0

export const updateUnsubmittedTicketMatches = (
	matches: TicketPosition[] | undefined,
	unsubmittedTickets: IUnsubmittedBetTicket[] | null,
	dispatch: Dispatch<AnyAction>,
	activeTicketID?: number,
	copied = false
) => {
	// TODO: copied does not work if user switching between ticket that is copied and then modified by match and switched in tab (corner case will be fixed in separated TASK)
	const data = unsubmittedTickets?.map((ticket) => {
		if (ticket.id === activeTicketID) {
			return {
				...ticket,
				matches
			}
		}
		return { ...ticket, copied }
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

export const getMaxGasLimitForNetwork = (networkId: NetworkId) => {
	if (networkId === NETWORK_IDS.ARBITRUM) return undefined
	return MAX_GAS_LIMIT
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
		return ticket.positions.find((position) => position.market.gameId === item.gameId)
	})

	return orderedPositions
}

export const roundToTwoDecimals = (number: number) => {
	return parseFloat((number / 100).toString())
}

export const getHandicapValue = (number: number, type: BET_OPTIONS.HANDICAP_AWAY | BET_OPTIONS.HANDICAP_HOME) => {
	if (type === BET_OPTIONS.HANDICAP_HOME) {
		return roundToTwoDecimals(number)
	}
	const oppositeNumber = -number
	const prefix = oppositeNumber >= 0 ? '+' : '-'
	return prefix + roundToTwoDecimals(Math.abs(oppositeNumber))
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

export const formatParlayQuote = (quote: number | undefined) => {
	if (!quote) return ''
	// AMM odds.
	const ammOdds = quote / OPTIMISM_DIVISOR

	return formatQuote(OddsType.DECIMAL, ammOdds)
}

export const formatPositionOdds = (match: Position) => {
	switch (match.side) {
		case PositionType.Away: {
			const ammOdds = Number(match.market.awayOdds) / OPTIMISM_DIVISOR
			return formatQuote(OddsType.DECIMAL, Number(ammOdds))
		}
		case PositionType.Draw: {
			const ammOdds = Number(match.market.drawOdds) / OPTIMISM_DIVISOR
			return formatQuote(OddsType.DECIMAL, ammOdds)
		}

		case PositionType.Home: {
			const ammOdds = Number(match.market.homeOdds) / OPTIMISM_DIVISOR
			return formatQuote(OddsType.DECIMAL, ammOdds)
		}
		default:
			return 0
	}
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

export const formatMatchCombinedPositionsQuote = (position1: number, position2: number, SGPFee: number) => {
	const odd = formatQuote(OddsType.DECIMAL, position1 * position2)
	const oddWithFee = floor(Number(odd) * SGPFee, 2).toFixed(2)
	return oddWithFee
}

export const formattedCombinedTypeMatch = (match: IMatch, customBetOption?: BET_OPTIONS) => {
	const betOption = customBetOption || match.betOption
	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(match.combinedTypeMatch?.SGPFee)
		)
	}
	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.awayOdds),
			Number(match.combinedTypeMatch?.SGPFee)
		)
	}
	if (betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER) {
		return formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.awayOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(match.combinedTypeMatch?.SGPFee)
		)
	}
	return formatMatchCombinedPositionsQuote(
		Number(match.winnerTypeMatch?.awayOdds),
		Number(match.totalTypeMatch?.awayOdds),
		Number(match.combinedTypeMatch?.SGPFee)
	)
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

export const getOddByBetType = (market: IMatch, copied: boolean, customBetOption?: BET_OPTIONS) => {
	// customBetOption is used for override match betOption (using in MatchListContent where we need to return odds based on type of odds in dropdown)
	// TODO: add logic for bonuses or create new function for bonuses
	const betOption = customBetOption || market.betOption
	switch (betOption) {
		// 1, 2, X
		case BET_OPTIONS.WINNER_HOME:
			return {
				formattedOdd: formatQuote(OddsType.DECIMAL, market.homeOdds),
				rawOdd: market.homeOdds,
				formattedBonus: getFormattedBonus(market.homeBonus),
				rawBonus: market.homeBonus
			}
		case BET_OPTIONS.WINNER_AWAY:
			return {
				formattedOdd: formatQuote(OddsType.DECIMAL, market.awayOdds),
				rawOdd: market.awayOdds,
				rawBonus: market.awayBonus,
				formattedBonus: getFormattedBonus(market.awayBonus)
			}
		case BET_OPTIONS.WINNER_DRAW:
			return {
				formattedOdd: formatQuote(OddsType.DECIMAL, market.drawOdds),
				rawOdd: market.drawOdds,
				rawBonus: market.drawBonus,
				formattedBonus: getFormattedBonus(market.drawBonus)
			}
		// H1, H2
		case BET_OPTIONS.HANDICAP_HOME:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: market.homeBonus
				  }
				: {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.spreadTypeMatch?.homeOdds),
						rawOdd: market.spreadTypeMatch?.homeOdds,
						formattedBonus: getFormattedBonus(market.spreadTypeMatch?.homeBonus),
						rawBonus: market.spreadTypeMatch?.homeBonus || 0
				  }
		case BET_OPTIONS.HANDICAP_AWAY:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: market.awayBonus
				  }
				: {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.spreadTypeMatch?.awayOdds),
						rawOdd: market.spreadTypeMatch?.awayOdds,
						formattedBonus: getFormattedBonus(market.spreadTypeMatch?.awayBonus),
						rawBonus: market.spreadTypeMatch?.awayBonus || 0
				  }
		// O, U
		case BET_OPTIONS.TOTAL_OVER:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: market.homeBonus
				  }
				: {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.totalTypeMatch?.homeOdds),
						rawOdd: market.totalTypeMatch?.homeOdds,
						formattedBonus: getFormattedBonus(market.totalTypeMatch?.homeBonus),
						rawBonus: market.totalTypeMatch?.homeBonus || 0
				  }
		case BET_OPTIONS.TOTAL_UNDER:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: market.awayBonus
				  }
				: {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.totalTypeMatch?.awayOdds),
						rawOdd: market.totalTypeMatch?.awayOdds,
						formattedBonus: getFormattedBonus(market.totalTypeMatch?.awayBonus),
						rawBonus: market.totalTypeMatch?.awayBonus || 0
				  }
		// X1, X2, 12
		case BET_OPTIONS.DOUBLE_CHANCE_HOME:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.homeOdds),
						rawOdd: market.homeOdds,
						formattedBonus: getFormattedBonus(market.homeBonus),
						rawBonus: market.homeBonus
				  }
				: {
						formattedOdd: formatQuote(
							OddsType.DECIMAL,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
							?.homeOdds,
						rawBonus:
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0,
						formattedBonus: getFormattedBonus(
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0
						)
				  }
		case BET_OPTIONS.DOUBLE_CHANCE_AWAY:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.awayOdds),
						rawOdd: market.awayOdds,
						formattedBonus: getFormattedBonus(market.awayBonus),
						rawBonus: market.awayBonus
				  }
				: {
						formattedOdd: formatQuote(
							OddsType.DECIMAL,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
							?.homeOdds,
						rawBonus:
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0,
						formattedBonus: getFormattedBonus(
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE)
								?.homeBonus || 0
						)
				  }
		case BET_OPTIONS.DOUBLE_CHANCE_DRAW:
			return copied
				? {
						formattedOdd: formatQuote(OddsType.DECIMAL, market.drawOdds),
						rawOdd: market.drawOdds,
						formattedBonus: getFormattedBonus(market.drawBonus),
						rawBonus: market.drawBonus
				  }
				: {
						formattedOdd: formatQuote(
							OddsType.DECIMAL,
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeOdds
						),
						rawOdd: market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeOdds,
						rawBonus:
							market.doubleChanceTypeMatches?.find((match) => match.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW)?.homeBonus || 0,
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
				formattedOdd: formattedCombinedTypeMatch(market, betOption),
				rawOdd: formattedCombinedTypeMatch(market, betOption),
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
		case RESOLUTIONS.MD:
			if (currentResolution === RESOLUTIONS.SM || currentResolution === RESOLUTIONS.MD) return true
			return false
		case RESOLUTIONS.LG:
			if (currentResolution === RESOLUTIONS.SM || currentResolution === RESOLUTIONS.MD || currentResolution === RESOLUTIONS.LG) return true
			return false
		case RESOLUTIONS.XL:
			if (
				currentResolution === RESOLUTIONS.SM ||
				currentResolution === RESOLUTIONS.MD ||
				currentResolution === RESOLUTIONS.LG ||
				currentResolution === RESOLUTIONS.XL
			)
				return true
			return false
		case RESOLUTIONS.SEMIXXL:
			if (
				currentResolution === RESOLUTIONS.SM ||
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

export const getCombinedPositionName = (markets: SportMarketInfo[], positions: any[]): CombinedMarketsPositionName | null => {
	if (markets[0].betType === BetType.WINNER && markets[1].betType === BetType.TOTAL) {
		if (positions[0] === 0 && positions[1] === 0) return '1&O'
		if (positions[0] === 0 && positions[1] === 1) return '1&U'
		if (positions[0] === 1 && positions[1] === 0) return '2&O'
		if (positions[0] === 1 && positions[1] === 1) return '2&U'
		if (positions[0] === 2 && positions[1] === 0) return 'X&O'
		if (positions[0] === 2 && positions[1] === 1) return 'X&U'
	}

	if (markets[0].betType === BetType.SPREAD && markets[1].betType === BetType.TOTAL) {
		if (positions[0] === 0 && positions[1] === 0) return 'H1&O'
		if (positions[0] === 0 && positions[1] === 1) return 'H1&U'
		if (positions[0] === 1 && positions[1] === 0) return 'H2&O'
		if (positions[0] === 1 && positions[1] === 1) return 'H2&U'
	}
	return null
}
