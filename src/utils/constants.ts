/* eslint-disable import/no-cycle */
import { keyBy } from 'lodash'
import { StablecoinKey } from './collaterals'
import { NetworkId } from './networkConnector'
import { ContractSGPOrder } from '@/utils/enums'
import { BetType } from '@/utils/tags'

export enum ENVIROMENT {
	PRODUCTION = 'production',
	DEVELOPMENT = 'development'
}

export enum ErrorNotificationTypes {
	TABLE = 'TABLE',
	PARLAY_LEADERBOARD = 'PARLAY_LEADERBOARD'
}

// NOTE: if more tags are added, the tag from match.winnerTypeMatch.match[0] must be added
export const TOTAL_WINNER_TAGS = ['109121', '9445', '9497'] // Golf, motosport, formula
export enum MSG_TYPE {
	INFO = 'INFO',
	ERROR = 'ERROR',
	WARNING = 'WARNING',
	SUCCESS = 'SUCCESS'
}

export const REFERRER_WALLET = '0x4ae4669aa1e5171d7c012b2f2ca48f41f701744a'

export enum NOTIFICATION_TYPE {
	MODAL = 'MODAL',
	NOTIFICATION = 'NOTIFICATION'
}

export enum TICKET_TYPE {
	OPEN_TICKET = 'OPEN_TICKET',
	ONGOING_TICKET = 'ONGOING_TICKET',
	CLOSED_TICKET = 'CLOSED_TICKET',
	HOT_TICKET = 'HOT_TICKET'
}

export enum CLOSED_TICKET_TYPE {
	SUCCESS = 'SUCCESS',
	MISS = 'MISS',
	CANCELLED = 'CANCELLED'
}

export enum MATCH_STATUS {
	SUCCESS = 'SUCCESS',
	MISS = 'MISS',
	CANCELED = 'CANCELED',
	OPEN = 'OPEN',
	PAUSED = 'PAUSED',
	ONGOING = 'ONGOING'
}

export const SPACE_GROTESK_FONT_VARIABLE = 'var(--space-grotesk-font)'

export const START_OF_BIWEEKLY_PERIOD = new Date(2023, 2, 1, 0, 0, 0)

export enum PARLAY_LEADERBOARD_SORTING {
	RANK = 'rank',
	POSITION = 'position',
	QUOTE = 'quote',
	PAID = 'paid',
	WON = 'won'
}

export enum TICKET_SORTING {
	SUCCESS_RATE = 'successRate',
	BUY_IN = 'buyIn',
	TOTAL_TICKET_QUOTE = 'totalTicketQuote',
	MATCHES = 'matches'
}

export const MIN_ODD_TRESHOLD = '1'

export enum ORDER_DIRECTION {
	ASCENDENT = 'asc',
	DESCENDENT = 'desc'
}
export const ADDITIONAL_SLIPPAGE = '0.02'

export const NETWORK_IDS = {
	ETHEREUM_MAINNET: 1,
	GOERLI: 5,
	OPTIMISM: 10,
	OPTIMISM_GOERLI: 420,
	ARBITRUM: 42161
}
export const MAX_TOTAL_QUOTE = 69

export const MIN_BUY_IN = 5

export const MAX_BUY_IN = 1000
export const NO_TEAM_IMAGE_FALLBACK = '/logos/defaultTeamLogo.png'
// PLACEHOLDER TO DO
export const INFURA_ID = 'fcf608e4430142f38338b55efef2c7e5' // '6052c0bd83aa437b8cf98c47d3b12cc7'

export const REVALIDATE = {
	MINUTE: 60,
	FIVE_MINUTES: 300,
	HALF_HOUR: 1800,
	HOUR: 3600
}

export const STABLE_DECIMALS = {
	sUSD: 18,
	DAI: 18,
	USDC: 6,
	USDT: 6
}

export const STABLE_COIN = {
	S_USD: 'sUSD',
	DAI: 'DAI',
	USDC: 'USDC',
	USDT: 'USDT'
}

export enum COLLATERALS_INDEX {
	'sUSD' = 0,
	'DAI' = 1,
	'USDC' = 2,
	'USDT' = 3
}

const CRYPTO_CURRENCY = ['USDC', 'USDT', 'DAI', 'sUSD']

export const FIELD_HEIGHT = {
	small: '40px',
	middle: '48px',
	large: '56px',
	extraLarge: '60px'
}

export const CRYPTO_CURRENCY_MAP = keyBy(CRYPTO_CURRENCY)

export enum Network {
	OptimismMainnet = 10,
	OptimismGoerli = 420,
	ArbitrumOne = 42161
}

export const COLLATERALS: Record<NetworkId, StablecoinKey[]> = {
	[NETWORK_IDS.OPTIMISM]: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	[NETWORK_IDS.OPTIMISM_GOERLI]: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	[NETWORK_IDS.ARBITRUM]: [CRYPTO_CURRENCY_MAP.USDC as StablecoinKey],
	5: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	10: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	420: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	42161: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	],
	42: [
		CRYPTO_CURRENCY_MAP.sUSD as StablecoinKey,
		CRYPTO_CURRENCY_MAP.DAI as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDC as StablecoinKey,
		CRYPTO_CURRENCY_MAP.USDT as StablecoinKey
	]
}
export const SGPCombinationsFromContractOrderMapping: Record<ContractSGPOrder, BetType[]> = {
	[ContractSGPOrder.MONEYLINETOTALS]: [0, 10002],
	[ContractSGPOrder.MONEYLINESPREAD]: [0, 10001],
	[ContractSGPOrder.SPREADTOTALS]: [10001, 10002]
}

export const MATCHES_OFFSET = 5
export const MAX_TICKET_MATCHES = 10
export const MAX_TICKETS = 5

export const SOCIAL_LINKS = {
	DISCORD: 'https://discord.com/invite/qDWSz6Zr',
	TWITTER: 'https://twitter.com/OvertimeMarkets',
	TERMS: 'https://overtimemarkets.xyz/static/media/thales-terms-of-use.9f69e9a2.pdf'
}

export const THALES_URL_SPORT_MARKETS_OPTIMISM = 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism'
export const THALES_URL_OVERTIME_ARBITRUM = 'https://api.thegraph.com/subgraphs/name/thales-markets/overtime-arbitrum'
export const THALES_URL_GOERLI = 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-goerli'
export const THALES_URL_OPTIMISM_GOERLI = 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism-goerli'

export const ENDPOINTS = {
	GET_PARLAY_LEADERBOARD: (networkID: number, period: number) => `https://api.thalesmarket.io/parlay-leaderboard/${networkID}/${period}`
}

export const EXTERNAL_SCRIPTS = {
	DISCORD_WIDGET: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'
}

export enum SportFilterEnum {
	Soccer = 'Soccer',
	Football = 'Football',
	Basketball = 'Basketball',
	Baseball = 'Baseball',
	Hockey = 'Hockey',
	MMA = 'Fighting sports',
	Tennis = 'Tennis',
	eSports = 'eSports',
	Cricket = 'Cricket',
	Motosport = 'Motosport',
	Golf = 'Golf'
}

export type PositionName = 'HOME' | 'AWAY' | 'DRAW'

export const STATIC = {
	ALL: 'all',
	WORLD: 'WORLD'
}

export enum PositionNumber {
	HOME = 0,
	AWAY = 1,
	DRAW = 2
}

export const POSITION_MAP: Record<PositionName, string> = {
	HOME: '1',
	DRAW: 'X',
	AWAY: '2'
}

export const APEX_TOP_GAME_POSITION_MAP: Record<string, string> = {
	HOME: 'yes',
	AWAY: 'no'
}

export const PARLAY_LEADERBOARD_FIRST_PERIOD_TOP_10_REWARDS = 6
export const PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_10 = [250, 175, 125, 100, 85, 70, 60, 50, 45, 40]
export const PARLAY_LEADERBOARD_OPTIMISM_REWARDS_TOP_20 = [
	300, 200, 150, 115, 100, 95, 90, 80, 70, 65, 60, 55, 50, 48, 46, 45, 44, 40, 38, 36, 35, 34, 32, 30, 28, 26, 25, 22, 21, 20
]

export const PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_10 = [250, 175, 125, 100, 85, 70, 60, 50, 45, 40]
export const PARLAY_LEADERBOARD_ARBITRUM_REWARDS_TOP_20 = [
	750, 500, 375, 286, 250, 238, 225, 200, 175, 162, 150, 138, 125, 120, 115, 113, 110, 100, 95, 90, 87, 85, 80, 75, 70, 65, 63, 55, 53, 50
]
export const DEFAULT_CURRENCY_DECIMALS = 2
export const SHORT_CURRENCY_DECIMALS = 4
export const LONG_CURRENCY_DECIMALS = 8
export const USD_SIGN = '$'

export enum OddsType {
	AMERICAN = 'AMERICAN',
	DECIMAL = 'DECIMAL',
	AMM = 'AMM'
}

export const EXPIRE_SINGLE_SPORT_MARKET_PERIOD_IN_DAYS = 90

export const GAS_ESTIMATION_BUFFER = 1.2

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETHERSCAN_TX_URL_OPTIMISM_GOERLI = 'https://goerli-optimism.etherscan.io/tx/'
export const ETHERSCAN_TX_URL_OPTIMISM = 'https://optimistic.etherscan.io/tx/'
export const ETHERSCAN_TX_URL_ARBITRUM = 'https://arbiscan.io//tx/'

export enum USER_TICKET_TYPE {
	SUCCESS = 'SUCCESS',
	MISS = 'MISS',
	PAUSED = 'PAUSED',
	CANCELED = 'CANCELED',
	ONGOING = 'ONGOING',
	OPEN = 'OPEN'
}

export const DISCORD_SPONGLY_SERVER = '1078244049980502077'
export const DISCORD_SPONGLY_CHANNEL = '1078244051171676181'

export const OPTIMISM_DIVISOR = 1000000000000000000

// max-allowance = 2**256 - 1
export const MAX_ALLOWANCE = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
