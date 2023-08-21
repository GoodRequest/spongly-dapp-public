import { IShareTags } from '@/atoms/SEOHelmet'
import { CLOSED_TICKET_TYPE, MSG_TYPE, ORDER_DIRECTION, PositionNumber, TICKET_TYPE } from '@/utils/constants'
import { SportMarket, ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'
import { BetType, DoubleChanceMarketType } from '@/utils/tags'
import { WALLET_TICKETS } from '@/utils/enums'

export type TagInfo = {
	id: number
	label: string
	logo?: string
	country: string
	logoClass?: string
}

export type Tags = TagInfo[]

export type SportsMap = Record<number, string>

export type SportsTagsMap = Record<string, number[]>

export interface IPagination {
	current?: number
	total?: number
	pageSize?: number
}

export interface IPage<T> {
	data: T
	shareTags: IShareTags
}

export interface IErrorMessage {
	type: MSG_TYPE
	message: string
}

export type MutipleCollateralBalance = {
	sUSD: number
	DAI: number
	USDC: number
	USDT: number
}

export type ParlayLeaderboardItem = {
	rank: number
	address: string
	position: number
	quote: number
	reward?: {
		iconUrl: any
		value: number
	}
}

export type ParlayLeaderboardTableItem = {
	rank: number
	address: string
	position: number
	quote: string | number
	paid: string | number
	won: string | number
	reward?: {
		iconUrl: any
		value: number
	}
	isLoading?: boolean
}

export type Option = {
	label: string
	value: string | number
}

export type GameDetails = {
	gameId: string
	gameLabel: string
}
export type AvailablePerPosition = Record<PositionNumber, { available?: number; buyBonus?: number }>
export interface Sorter {
	property?: string
	direction?: ORDER_DIRECTION
}

export type ITicket = ParlayMarket &
	PositionBalance &
	SportMarket & {
		successRate: number
		matches: number
		ticketType: TICKET_TYPE
		closedTicketType: CLOSED_TICKET_TYPE
		buyIn: number
		totalTicketQuote: number
	}

export type SGPItem = { tags: number[]; combination: BetType[]; SGPFee: number }

type SGPContractDataItem = [number, number, number, number]

export type SGPContractData = SGPContractDataItem[]

export type SportMarketInfo = {
	id: string
	address: string
	gameId: string
	maturityDate: Date
	tags: number[]
	isOpen: boolean
	isResolved: boolean
	isCanceled: boolean
	finalResult: number
	poolSize: number
	numberOfParticipants: number
	homeTeam: string
	awayTeam: string
	homeOdds: number
	awayOdds: number
	drawOdds: number | undefined
	homeScore: number | string
	awayScore: number | string
	sport: string
	isApex: boolean
	resultDetails: string
	isPaused: boolean
	leagueRaceName?: string
	qualifyingStartTime?: number
	arePostQualifyingOddsFetched: boolean
	betType: number
	homeBonus: number
	awayBonus: number
	drawBonus?: number
	parentMarket: string
	spread: number
	total: number
	doubleChanceMarketType: DoubleChanceMarketType | null
}

export type MarketData = {
	address: string
	gameDetails: GameDetails
	positions: Record<PositionNumber, { odd: number | undefined }>
	tags: number[]
	homeTeam: string
	awayTeam: string
	maturityDate: number
	resolved: boolean
	cancelled: boolean
	finalResult: number
	gameStarted: boolean
	homeScore?: number
	awayScore?: number
	leagueRaceName?: string
	paused: boolean
	betType: number
	isApex: boolean
	parentMarket: string
	childMarketsAddresses: string[]
	childMarkets: MarketData[]
	spread: number
	total: number
	doubleChanceMarketType: DoubleChanceMarketType | null
}

export type UserTicket = {
	id: number | string
	won: boolean | undefined
	claimed: boolean | undefined
	sUSDPaid: number
	txHash: string
	quote: string | undefined | null
	amount: number
	maturityDate: string
	marketQuotes?: string[]
	sportMarketsFromContract?: string[]
	ticketType: WALLET_TICKETS
	isClaimable: boolean
	positions: [
		{
			side: string
			claimable: boolean
			awayOdds: number | string
			awayTeam: string
			finalResult: null | string
			homeOdds: number | string
			homeTeam: string
			isCanceled: boolean
			isOpen: boolean
			isPaused: false
			isResolved: boolean
			marketAddress: string
			maturityDate: string
			tags?: [] | undefined
			market: SportMarket
		}
	]
	sportMarkets?: [
		{
			gameId: string
			address: string
			isCanceled: boolean
		}
	]
}

export type User = {
	pnl: number | null | undefined
	trades: number | null | undefined
	volume: number | null | undefined
	successRate: number
}

export type UserStatistic = {
	user: User
	tickets: UserTicket[]
}

export interface IMatch extends SportMarket {
	winnerTypeMatch?: SportMarket
	doubleChanceTypeMatches?: SportMarket[]
	spreadTypeMatch?: SportMarket
	totalTypeMatch?: SportMarket
	betOption?: any
}
