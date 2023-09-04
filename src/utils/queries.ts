import { gql } from '@apollo/client'

export const GET_ALL_SPORT_MARKETS = gql`
	query getSportsMarket($skip: Int!) {
		sportMarkets(first: 1000, skip: $skip, orderBy: maturityDate, orderDirection: desc) {
			id
			timestamp
			address
			gameId
			isOpen
			isCanceled
			isPaused
			isResolved
			awayTeam
			awayScore
			betType
			spread
			total
			finalResult
			homeScore
			homeTeam
			maturityDate
			tags
			total
			homeOdds
			awayOdds
			drawOdds
			doubleChanceMarketType
		}
	}
`

export const GET_USERS_STATISTICS = gql`
	query getUser($id: String!) {
		user(id: $id) {
			pnl
			trades
			volume
		}
		parlayMarkets(first: 1000, skip: 0, orderBy: timestamp, orderDirection: desc, where: { account: $id }) {
			account
			claimed
			id
			sUSDPaid
			lastGameStarts
			marketQuotes
			totalQuote
			totalAmount
			timestamp
			txHash
			won
			sportMarketsFromContract
			positions {
				claimable
				id
				side
				market {
					id
					gameId
					address
					doubleChanceMarketType
					homeTeam
					homeScore
					homeOdds
					awayOdds
					awayScore
					awayTeam
					drawOdds
					betType
					finalResult
					isCanceled
					isOpen
					isPaused
					isResolved
					maturityDate
					tags
				}
			}
			sportMarkets {
				gameId
				address
				isCanceled
			}
		}
		positionBalances(first: 1000, skip: 0, where: { account: $id }) {
			sUSDPaid
			firstTxHash
			amount
			id
			claimed
			position {
				claimable
				id
				side
				market {
					id
					address
					doubleChanceMarketType
					homeTeam
					homeScore
					homeOdds
					gameId
					awayOdds
					awayScore
					drawOdds
					awayTeam
					betType
					finalResult
					isCanceled
					isOpen
					isPaused
					isResolved
					maturityDate
					tags
				}
			}
		}
	}
`

export const GET_TICKETS = gql`
	query getParleyMarket($skipParlay: Int!, $firstParlay: Int!, $skipSingle: Int!, $firstSingle: Int!) {
		parlayMarkets(first: $firstParlay, skip: $skipParlay, orderBy: timestamp, orderDirection: desc) {
			id
			claimed
			sUSDPaid
			timestamp
			totalQuote
			won
			account
			totalAmount
			lastGameStarts
			marketQuotes
			positions(first: 10, skip: 0) {
				claimable
				id
				side
				market {
					id
					address
					doubleChanceMarketType
					homeTeam
					homeScore
					homeOdds
					awayOdds
					awayScore
					awayTeam
					betType
					finalResult
					isCanceled
					isOpen
					isPaused
					isResolved
					maturityDate
					tags
					gameId
				}
			}
			sportMarkets {
				gameId
				address
				isCanceled
			}
		}
		positionBalances(first: $firstSingle, skip: $skipSingle) {
			account
			amount
			id
			sUSDPaid
			position {
				side
				id
				claimable
				market {
					address
					awayOdds
					awayScore
					awayTeam
					betType
					downAddress
					drawAddress
					drawOdds
					doubleChanceMarketType
					finalResult
					homeOdds
					homeScore
					homeTeam
					id
					isCanceled
					isOpen
					isPaused
					isResolved
					total
					timestamp
					resultDetails
					tags
					maturityDate
					gameId
				}
			}
		}
	}
`
