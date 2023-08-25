import { GraphQLResolveInfo } from 'graphql'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
}

export enum AmmType {
	Parlay = 'parlay',
	Single = 'single'
}

export type BuyTransaction = {
	__typename?: 'BuyTransaction'
	id: Scalars['ID']
	marketTransactionId: Scalars['String']
	positionBalanceId: Scalars['String']
}

export type ClaimTx = {
	__typename?: 'ClaimTx'
	account: Scalars['String']
	amount: Scalars['String']
	caller: Scalars['String']
	id: Scalars['ID']
	market: SportMarket
	timestamp: Scalars['String']
}

export type SportMarket = {
	__typename?: 'SportMarket'
	address: Scalars['String']
	arePostQualifyingOddsFetched?: Maybe<Scalars['Boolean']>
	awayOdds: Scalars['String']
	awayScore?: Maybe<Scalars['String']>
	awayTeam: Scalars['String']
	betType?: Maybe<Scalars['String']>
	doubleChanceMarketType?: Maybe<Scalars['String']>
	downAddress: Scalars['String']
	drawAddress: Scalars['String']
	drawOdds: Scalars['String']
	finalResult: Scalars['String']
	gameId: Scalars['String']
	homeOdds: Scalars['String']
	homeScore?: Maybe<Scalars['String']>
	homeTeam: Scalars['String']
	id: Scalars['ID']
	isApex?: Maybe<Scalars['Boolean']>
	isCanceled: Scalars['Boolean']
	isOpen: Scalars['Boolean']
	isPaused: Scalars['Boolean']
	isResolved: Scalars['Boolean']
	leagueRaceName?: Maybe<Scalars['String']>
	maturityDate: Scalars['String']
	numberOfParticipants: Scalars['String']
	parentMarket?: Maybe<Scalars['String']>
	poolSize: Scalars['String']
	qualifyingStartTime?: Maybe<Scalars['String']>
	resultDetails?: Maybe<Scalars['String']>
	spread?: Maybe<Scalars['String']>
	tags?: Maybe<Array<Scalars['String']>>
	timestamp: Scalars['String']
	total?: Maybe<Scalars['String']>
	upAddress: Scalars['String']
}

export type GameIdToParentMarket = {
	__typename?: 'GameIdToParentMarket'
	id: Scalars['ID']
	parentMarket: Scalars['String']
}

export type LiquidityPool = {
	__typename?: 'LiquidityPool'
	address: Scalars['String']
	id: Scalars['ID']
	liquidityPoolType: LiquidityPoolType
	round: Scalars['String']
}

export enum LiquidityPoolType {
	Parlay = 'parlay',
	Single = 'single'
}

export type LiquidityPoolPnl = {
	__typename?: 'LiquidityPoolPnl'
	id: Scalars['ID']
	liquidityPool: Scalars['String']
	liquidityPoolType: LiquidityPoolType
	pnl: Scalars['String']
	round: Scalars['String']
	timestamp: Scalars['String']
}

export type LiquidityPoolUserTransaction = {
	__typename?: 'LiquidityPoolUserTransaction'
	account: Scalars['String']
	amount?: Maybe<Scalars['String']>
	blockNumber: Scalars['String']
	hash: Scalars['String']
	id: Scalars['ID']
	liquidityPool: Scalars['String']
	liquidityPoolType: LiquidityPoolType
	round: Scalars['String']
	timestamp: Scalars['String']
	type: LiquidityPoolUserTransactionType
}

export enum LiquidityPoolUserTransactionType {
	Claim = 'claim',
	Deposit = 'deposit',
	WithdrawalRequest = 'withdrawalRequest'
}

export type MarketTransaction = {
	__typename?: 'MarketTransaction'
	account: Scalars['String']
	amount: Scalars['String']
	blockNumber: Scalars['String']
	hash: Scalars['String']
	id: Scalars['ID']
	market: Scalars['String']
	paid: Scalars['String']
	position: Scalars['String']
	positionBalance: PositionBalance
	timestamp: Scalars['String']
	type: MarketTransactionType
	wholeMarket: SportMarket
}

export type PositionBalance = {
	__typename?: 'PositionBalance'
	account: Scalars['String']
	amount: Scalars['String']
	claimed: Scalars['Boolean']
	firstTxHash: Scalars['String']
	id: Scalars['ID']
	position: Position
	sUSDPaid: Scalars['String']
}

export type Position = {
	__typename?: 'Position'
	claimable: Scalars['Boolean']
	id: Scalars['ID']
	market: SportMarket
	side: PositionType
}

export enum PositionType {
	Away = 'away',
	Draw = 'draw',
	Home = 'home'
}

export enum MarketTransactionType {
	Buy = 'buy',
	Sell = 'sell'
}

export type OvertimeVoucher = {
	__typename?: 'OvertimeVoucher'
	address: Scalars['String']
	id: Scalars['ID']
}

export type ParentMarketToDoubleChanceMarket = {
	__typename?: 'ParentMarketToDoubleChanceMarket'
	awayTeamNotToLoseMarket: Scalars['String']
	homeTeamNotToLoseMarket: Scalars['String']
	id: Scalars['ID']
	noDrawMarket: Scalars['String']
}

export type ParlayMarket = {
	__typename?: 'ParlayMarket'
	account: Scalars['String']
	blockNumber: Scalars['String']
	claimed: Scalars['Boolean']
	id: Scalars['ID']
	lastGameStarts: Scalars['String']
	marketQuotes?: Maybe<Array<Scalars['String']>>
	positions: Array<Position>
	positionsFromContract: Array<Scalars['String']>
	skewImpact?: Maybe<Scalars['String']>
	sportMarkets: Array<SportMarket>
	sportMarketsFromContract: Array<Scalars['String']>
	sUSDAfterFees?: Maybe<Scalars['String']>
	sUSDPaid?: Maybe<Scalars['String']>
	timestamp: Scalars['String']
	totalAmount: Scalars['String']
	totalQuote?: Maybe<Scalars['String']>
	txHash: Scalars['String']
	won: Scalars['Boolean']
}

export type ParlayVaultTransaction = {
	__typename?: 'ParlayVaultTransaction'
	blockNumber: Scalars['String']
	hash: Scalars['String']
	id: Scalars['ID']
	market: Scalars['String']
	paid: Scalars['String']
	round: Scalars['String']
	timestamp: Scalars['String']
	vault: Scalars['String']
	wholeMarket: ParlayMarket
}

export type Race = {
	__typename?: 'Race'
	id: Scalars['ID']
	qualifyingStartTime: Scalars['String']
	raceName: Scalars['String']
	startTime: Scalars['String']
}

export type ReferralTransaction = {
	__typename?: 'ReferralTransaction'
	ammType: AmmType
	amount: Scalars['String']
	id: Scalars['ID']
	referrer: Referrer
	timestamp: Scalars['String']
	trader: ReferredTrader
	volume: Scalars['String']
}

export type Referrer = {
	__typename?: 'Referrer'
	id: Scalars['ID']
	timestamp: Scalars['String']
	totalEarned: Scalars['String']
	totalVolume: Scalars['String']
	trades: Scalars['String']
}

export type ReferredTrader = {
	__typename?: 'ReferredTrader'
	id: Scalars['ID']
	referrer: Referrer
	timestamp: Scalars['String']
	totalAmount: Scalars['String']
	totalVolume: Scalars['String']
	trades: Scalars['String']
}

export type User = {
	__typename?: 'User'
	id: Scalars['ID']
	pnl: Scalars['String']
	trades?: Maybe<Scalars['Int']>
	volume: Scalars['String']
}

export type Vault = {
	__typename?: 'Vault'
	address: Scalars['String']
	id: Scalars['ID']
	round: Scalars['String']
}

export type VaultPnl = {
	__typename?: 'VaultPnl'
	id: Scalars['ID']
	pnl: Scalars['String']
	round: Scalars['String']
	timestamp: Scalars['String']
	vault: Scalars['String']
}

export type VaultTransaction = {
	__typename?: 'VaultTransaction'
	amount: Scalars['String']
	blockNumber: Scalars['String']
	hash: Scalars['String']
	id: Scalars['ID']
	market: Scalars['String']
	paid: Scalars['String']
	position: Scalars['String']
	round: Scalars['String']
	timestamp: Scalars['String']
	vault: Scalars['String']
	wholeMarket: SportMarket
}

export type VaultUserTransaction = {
	__typename?: 'VaultUserTransaction'
	account: Scalars['String']
	amount?: Maybe<Scalars['String']>
	blockNumber: Scalars['String']
	hash: Scalars['String']
	id: Scalars['ID']
	round: Scalars['String']
	timestamp: Scalars['String']
	type: VaultUserTransactionType
	vault: Scalars['String']
}

export enum VaultUserTransactionType {
	Claim = 'claim',
	Deposit = 'deposit',
	WithdrawalRequest = 'withdrawalRequest'
}

export type Zebro = {
	__typename?: 'Zebro'
	country: Scalars['String']
	countryName: Scalars['String']
	id: Scalars['ID']
	owner: Scalars['String']
	tokenId: Scalars['String']
	url: Scalars['String']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
	resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
	| ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	String: ResolverTypeWrapper<Scalars['String']>
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>
	AmmType: AmmType
	BuyTransaction: ResolverTypeWrapper<BuyTransaction>
	ID: ResolverTypeWrapper<Scalars['ID']>
	ClaimTx: ResolverTypeWrapper<ClaimTx>
	SportMarket: ResolverTypeWrapper<SportMarket>
	GameIdToParentMarket: ResolverTypeWrapper<GameIdToParentMarket>
	Int: ResolverTypeWrapper<Scalars['Int']>
	LiquidityPool: ResolverTypeWrapper<LiquidityPool>
	LiquidityPoolType: LiquidityPoolType
	LiquidityPoolPnl: ResolverTypeWrapper<LiquidityPoolPnl>
	LiquidityPoolUserTransaction: ResolverTypeWrapper<LiquidityPoolUserTransaction>
	LiquidityPoolUserTransactionType: LiquidityPoolUserTransactionType
	MarketTransaction: ResolverTypeWrapper<MarketTransaction>
	PositionBalance: ResolverTypeWrapper<PositionBalance>
	Position: ResolverTypeWrapper<Position>
	PositionType: PositionType
	MarketTransactionType: MarketTransactionType
	OvertimeVoucher: ResolverTypeWrapper<OvertimeVoucher>
	ParentMarketToDoubleChanceMarket: ResolverTypeWrapper<ParentMarketToDoubleChanceMarket>
	ParlayMarket: ResolverTypeWrapper<ParlayMarket>
	ParlayVaultTransaction: ResolverTypeWrapper<ParlayVaultTransaction>
	Race: ResolverTypeWrapper<Race>
	ReferralTransaction: ResolverTypeWrapper<ReferralTransaction>
	Referrer: ResolverTypeWrapper<Referrer>
	ReferredTrader: ResolverTypeWrapper<ReferredTrader>
	User: ResolverTypeWrapper<User>
	Vault: ResolverTypeWrapper<Vault>
	VaultPnl: ResolverTypeWrapper<VaultPnl>
	VaultTransaction: ResolverTypeWrapper<VaultTransaction>
	VaultUserTransaction: ResolverTypeWrapper<VaultUserTransaction>
	VaultUserTransactionType: VaultUserTransactionType
	Zebro: ResolverTypeWrapper<Zebro>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	String: Scalars['String']
	Boolean: Scalars['Boolean']
	BuyTransaction: BuyTransaction
	ID: Scalars['ID']
	ClaimTx: ClaimTx
	SportMarket: SportMarket
	GameIdToParentMarket: GameIdToParentMarket
	Int: Scalars['Int']
	LiquidityPool: LiquidityPool
	LiquidityPoolPnl: LiquidityPoolPnl
	LiquidityPoolUserTransaction: LiquidityPoolUserTransaction
	MarketTransaction: MarketTransaction
	PositionBalance: PositionBalance
	Position: Position
	OvertimeVoucher: OvertimeVoucher
	ParentMarketToDoubleChanceMarket: ParentMarketToDoubleChanceMarket
	ParlayMarket: ParlayMarket
	ParlayVaultTransaction: ParlayVaultTransaction
	Race: Race
	ReferralTransaction: ReferralTransaction
	Referrer: Referrer
	ReferredTrader: ReferredTrader
	User: User
	Vault: Vault
	VaultPnl: VaultPnl
	VaultTransaction: VaultTransaction
	VaultUserTransaction: VaultUserTransaction
	Zebro: Zebro
}

export type BuyTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BuyTransaction'] = ResolversParentTypes['BuyTransaction']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	marketTransactionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	positionBalanceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ClaimTxResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClaimTx'] = ResolversParentTypes['ClaimTx']> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	caller?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	market?: Resolver<ResolversTypes['SportMarket'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SportMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['SportMarket'] = ResolversParentTypes['SportMarket']> = {
	address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	arePostQualifyingOddsFetched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	awayOdds?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	awayScore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	awayTeam?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	betType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	doubleChanceMarketType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	downAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	drawAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	drawOdds?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	finalResult?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	gameId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	homeOdds?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	homeScore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	homeTeam?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	isApex?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	isCanceled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	isPaused?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	isResolved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	leagueRaceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	maturityDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	numberOfParticipants?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	parentMarket?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	poolSize?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	qualifyingStartTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	resultDetails?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	spread?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	total?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	upAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GameIdToParentMarketResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['GameIdToParentMarket'] = ResolversParentTypes['GameIdToParentMarket']
> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	parentMarket?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LiquidityPoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['LiquidityPool'] = ResolversParentTypes['LiquidityPool']> = {
	address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	liquidityPoolType?: Resolver<ResolversTypes['LiquidityPoolType'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LiquidityPoolPnlResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['LiquidityPoolPnl'] = ResolversParentTypes['LiquidityPoolPnl']
> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	liquidityPool?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	liquidityPoolType?: Resolver<ResolversTypes['LiquidityPoolType'], ParentType, ContextType>
	pnl?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LiquidityPoolUserTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['LiquidityPoolUserTransaction'] = ResolversParentTypes['LiquidityPoolUserTransaction']
> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	amount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	liquidityPool?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	liquidityPoolType?: Resolver<ResolversTypes['LiquidityPoolType'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	type?: Resolver<ResolversTypes['LiquidityPoolUserTransactionType'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MarketTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['MarketTransaction'] = ResolversParentTypes['MarketTransaction']
> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	market?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	paid?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	position?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	positionBalance?: Resolver<ResolversTypes['PositionBalance'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	type?: Resolver<ResolversTypes['MarketTransactionType'], ParentType, ContextType>
	wholeMarket?: Resolver<ResolversTypes['SportMarket'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PositionBalanceResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['PositionBalance'] = ResolversParentTypes['PositionBalance']
> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	claimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	firstTxHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>
	sUSDPaid?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = {
	claimable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	market?: Resolver<ResolversTypes['SportMarket'], ParentType, ContextType>
	side?: Resolver<ResolversTypes['PositionType'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OvertimeVoucherResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['OvertimeVoucher'] = ResolversParentTypes['OvertimeVoucher']
> = {
	address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ParentMarketToDoubleChanceMarketResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['ParentMarketToDoubleChanceMarket'] = ResolversParentTypes['ParentMarketToDoubleChanceMarket']
> = {
	awayTeamNotToLoseMarket?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	homeTeamNotToLoseMarket?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	noDrawMarket?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ParlayMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParlayMarket'] = ResolversParentTypes['ParlayMarket']> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	claimed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	lastGameStarts?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	marketQuotes?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
	positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType>
	positionsFromContract?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
	skewImpact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	sportMarkets?: Resolver<Array<ResolversTypes['SportMarket']>, ParentType, ContextType>
	sportMarketsFromContract?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
	sUSDAfterFees?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	sUSDPaid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalQuote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	txHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	won?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ParlayVaultTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['ParlayVaultTransaction'] = ResolversParentTypes['ParlayVaultTransaction']
> = {
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	market?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	paid?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	vault?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	wholeMarket?: Resolver<ResolversTypes['ParlayMarket'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type RaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Race'] = ResolversParentTypes['Race']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	qualifyingStartTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	raceName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ReferralTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['ReferralTransaction'] = ResolversParentTypes['ReferralTransaction']
> = {
	ammType?: Resolver<ResolversTypes['AmmType'], ParentType, ContextType>
	amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	referrer?: Resolver<ResolversTypes['Referrer'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	trader?: Resolver<ResolversTypes['ReferredTrader'], ParentType, ContextType>
	volume?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ReferrerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Referrer'] = ResolversParentTypes['Referrer']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalEarned?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalVolume?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	trades?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ReferredTraderResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReferredTrader'] = ResolversParentTypes['ReferredTrader']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	referrer?: Resolver<ResolversTypes['Referrer'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	totalVolume?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	trades?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	pnl?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	trades?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	volume?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VaultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vault'] = ResolversParentTypes['Vault']> = {
	address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VaultPnlResolvers<ContextType = any, ParentType extends ResolversParentTypes['VaultPnl'] = ResolversParentTypes['VaultPnl']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	pnl?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	vault?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VaultTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['VaultTransaction'] = ResolversParentTypes['VaultTransaction']
> = {
	amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	market?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	paid?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	position?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	vault?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	wholeMarket?: Resolver<ResolversTypes['SportMarket'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type VaultUserTransactionResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['VaultUserTransaction'] = ResolversParentTypes['VaultUserTransaction']
> = {
	account?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	amount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	blockNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	round?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	type?: Resolver<ResolversTypes['VaultUserTransactionType'], ParentType, ContextType>
	vault?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ZebroResolvers<ContextType = any, ParentType extends ResolversParentTypes['Zebro'] = ResolversParentTypes['Zebro']> = {
	country?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	countryName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
	BuyTransaction?: BuyTransactionResolvers<ContextType>
	ClaimTx?: ClaimTxResolvers<ContextType>
	SportMarket?: SportMarketResolvers<ContextType>
	GameIdToParentMarket?: GameIdToParentMarketResolvers<ContextType>
	LiquidityPool?: LiquidityPoolResolvers<ContextType>
	LiquidityPoolPnl?: LiquidityPoolPnlResolvers<ContextType>
	LiquidityPoolUserTransaction?: LiquidityPoolUserTransactionResolvers<ContextType>
	MarketTransaction?: MarketTransactionResolvers<ContextType>
	PositionBalance?: PositionBalanceResolvers<ContextType>
	Position?: PositionResolvers<ContextType>
	OvertimeVoucher?: OvertimeVoucherResolvers<ContextType>
	ParentMarketToDoubleChanceMarket?: ParentMarketToDoubleChanceMarketResolvers<ContextType>
	ParlayMarket?: ParlayMarketResolvers<ContextType>
	ParlayVaultTransaction?: ParlayVaultTransactionResolvers<ContextType>
	Race?: RaceResolvers<ContextType>
	ReferralTransaction?: ReferralTransactionResolvers<ContextType>
	Referrer?: ReferrerResolvers<ContextType>
	ReferredTrader?: ReferredTraderResolvers<ContextType>
	User?: UserResolvers<ContextType>
	Vault?: VaultResolvers<ContextType>
	VaultPnl?: VaultPnlResolvers<ContextType>
	VaultTransaction?: VaultTransactionResolvers<ContextType>
	VaultUserTransaction?: VaultUserTransactionResolvers<ContextType>
	Zebro?: ZebroResolvers<ContextType>
}
