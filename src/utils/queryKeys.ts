import { LiquidityPoolType } from '@/typescript/liquidityPool'
import { GlobalFiltersEnum } from './markets'
import { NetworkId } from './networkConnector'
import { Network, PositionNumber } from './constants'

const QUERY_KEYS = {
	ParlayMarkets: (networkId: NetworkId, account: string) => ['parlayMarkets', networkId, account],
	ParlayLeaderboard: (networkId: NetworkId, period: number) => ['parlayLeaderboard', period, networkId],
	SportMarkets: (globalFilter: GlobalFiltersEnum, networkId: NetworkId) => ['sportMarkets', globalFilter, networkId],
	SportMarket: (address: string, networkId: NetworkId) => ['sportMarket', address, networkId],
	ParlayAmmData: (networkId: NetworkId) => ['parlayAmmData', networkId],
	LiveResult: (marketId: string) => ['liveResult', marketId],
	EnetpulseLiveResult: (marketId: string, gameDate: string, sportTag: number) => ['enetpulseLiveResult', marketId, gameDate, sportTag],
	JsonOddsData: (marketId: string, sportTag: number) => ['jsonOddsData', marketId, sportTag],
	PositionDetails: (marketAddress: string, position: PositionNumber, amount: number, stableIndex: number, networkId: NetworkId) => [
		'positionDetails',
		marketAddress,
		position,
		amount,
		stableIndex,
		networkId
	],
	AvailablePerPosition: (marketAddress: string) => ['availablePerPosition', marketAddress],
	AvailablePerPositionMulti: (marketAddresses: string) => ['availablePerPositionMulti', marketAddresses],
	AvailablePerDoubleChancePosition: (marketAddress: string) => ['availablePerDoubleChancePosition', marketAddress],
	MarketTransactions: (marketAddress: string, networkId: NetworkId, walletAddress?: string) => [
		'market',
		'transactions',
		marketAddress,
		networkId,
		walletAddress
	],
	MarketDuration: (networkId: NetworkId) => ['marketDuration', networkId],
	UserTransactions: (walletAddress: string, networkId: NetworkId) => ['user', 'transactions', walletAddress, networkId],
	WinningInfo: (walletAddress: string, networkId: NetworkId) => ['user', 'winningInfo', walletAddress, networkId],
	ClaimTx: (market: string, networkId: NetworkId) => ['claim', 'transactions', market, networkId],
	ClaimableCount: (walletAddress: string, networkId: NetworkId) => ['claimable', 'count', walletAddress, networkId],
	AccountPositions: (walletAddress: string, networkId: NetworkId) => ['accountPosition', walletAddress, networkId],
	ReferralTransaction: (walletAddress: string, networkId: NetworkId) => ['referralTransaction', walletAddress, networkId],
	ReferrerID: (walletAddress: string) => ['referrerId', walletAddress],
	Referrers: (networkId: NetworkId) => ['referrers', networkId],
	ReferredTraders: (walletAddress: string, networkId: NetworkId) => ['referredTraders', walletAddress, networkId],
	ReferralOverview: (walletAddress: string, networkId: NetworkId) => ['referralOverview', walletAddress, networkId],
	Wallet: {
		GetsUSDWalletBalance: (walletAddress: string, networkId: NetworkId) => ['sUsd', 'balance', walletAddress, networkId],
		TokenBalance: (token: string, walletAddress: string, networkId: NetworkId) => ['wallet', 'tokenBalance', token, walletAddress, networkId],
		MultipleCollateral: (walletAddress: string, networkId: NetworkId) => ['multipleCollateral', walletAddress, networkId],
		OvertimeVoucher: (walletAddress: string, networkId: NetworkId) => ['wallet', 'overtimeVoucher', walletAddress, networkId],
		OvertimeVoucherEscrow: (walletAddress: string, networkId: NetworkId) => ['wallet', 'overtimeVoucherEscrow', walletAddress, networkId],
		Stats: (networkId: NetworkId, walletAddress: string) => ['wallet', 'stats', networkId, walletAddress],
		VaultsAndLpTxs: (networkId: NetworkId, walletAddress: string) => ['wallet', 'vaultsAndLpTxs', networkId, walletAddress]
	},
	Quiz: {
		Leaderboard: () => ['quiz', 'leaderboard']
	},
	FavoriteTeam: (walletAddress: string, networkId: NetworkId) => ['favoriteTeam', walletAddress, networkId],
	Vault: {
		Data: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'data', networkId],
		UserData: (vaultAddress: string, walletAddress: string, networkId: NetworkId) => [vaultAddress, 'data', walletAddress, networkId],
		AllVaultsUserData: (walletAddress: string, networkId: NetworkId) => ['data', walletAddress, networkId],
		Trades: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'trades', networkId],
		ParlayTrades: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'parlayTrades', networkId],
		PnL: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'pnl', networkId],
		UserTransactions: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'userTransactions', networkId]
	},
	Bungee: {
		Tokens: () => ['bungee', 'tokens']
	},
	Banners: (networkId: NetworkId) => ['banners', networkId],
	LiquidityPool: {
		Data: (networkId: NetworkId) => ['liquidityPool', 'data', networkId],
		ParlayData: (networkId: NetworkId) => ['liquidityPool', 'parlayData', networkId],
		UserData: (walletAddress: string, networkId: NetworkId) => ['liquidityPool', 'data', walletAddress, networkId],
		ParlayUserData: (walletAddress: string, networkId: NetworkId) => ['liquidityPool', 'parlayLPData', walletAddress, networkId],
		PnL: (networkId: NetworkId, liquidityPoolType: LiquidityPoolType) => ['liquidityPool', 'pnl', liquidityPoolType, networkId],
		Return: (networkId: NetworkId, liquidityPoolType: LiquidityPoolType) => ['liquidityPool', 'return', liquidityPoolType, networkId],
		UserTransactions: (networkId: NetworkId, liquidityPoolType: LiquidityPoolType) => ['liquidityPool', 'userTransactions', liquidityPoolType, networkId]
	},
	SGPFees: (networkId: NetworkId) => ['sgpFees', networkId],
	CheckPausedAMM: (networkId: NetworkId) => ['checkPausedAMM', networkId],
	Rates: {
		ExchangeRates: (networkId: Network) => ['rates', 'exchangeRates', networkId]
	}
}

export default QUERY_KEYS
