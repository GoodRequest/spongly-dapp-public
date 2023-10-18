import { gql } from '@apollo/client'

export const THALES_TIPSTER_BOTS = ['0x82b3634c0518507d5d817be6dab6233ebe4d68d9']

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
			homeOdds
			awayOdds
			drawOdds
			doubleChanceMarketType
		}
	}
`

export const GET_SPORT_MARKETS_FOR_GAME = gql`
	query getSportsMarketForGameIds($gameId_in: [String!]) {
		sportMarkets(first: 1000, where: { gameId_in: $gameId_in }) {
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
			homeOdds
			awayOdds
			drawOdds
			doubleChanceMarketType
		}
	}
`

export const GET_TIPSTERS = gql`
	query getTipsters($skip: Int!, $orderBy: String!, $orderDirection: String!, $first: Int!) {
		users(
			first: $first
			skip: $skip
			orderBy: $orderBy
			orderDirection: $orderDirection
			# NOTE: bots from thales that need to be filtered and not showed in list of tipsters
			where: {
				trades_gt: 0
				id_not_in: [
					"0x82b3634c0518507d5d817be6dab6233ebe4d68d9"
					"0x81e1f62d4f5722daa0c2f87137228d0b59516aba"
					"0xff936b80783b32ad3f2b4e610d04c9778c4669a0"
					"0x8314125c8b68af2afd0d151eb4a551e88128a2ae"
					"0x9841484a4a6c0b61c4eea71376d76453fd05ec9c"
					"0xc922f4CDe42dD658A7D3EA852caF7Eae47F6cEcd"
					"0xBaaC5464BF6E767C9af0E8d4677C01Be2065fd5F"
					"0x43D19841D818B2ccC63a8B44Ce8C7DEF8616D98E"
					"0xb484027CB0c538538Bad2bE492714154f9196F93"
					"0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F"
					"0x43318DE9E8f65b591598F17aDD87ae7247649C83"
					"0x8285047F33c26c1Bf5B387f2b07F21A2aF29Ace2"
				]
			}
		) {
			volume
			trades
			pnl
			id
		}
	}
`

export const GET_USERS_TRANSACTIONS = gql`
	query geetUsersTransactions($account: String!) {
		marketTransactions(first: 1000, skip: 0, where: { account: $account }) {
			timestamp
			positionBalance {
				id
			}
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
		parlayMarkets(
			first: $firstParlay
			skip: $skipParlay
			orderBy: timestamp
			orderDirection: desc
			where: {
				account_not_in: [
					"0x82b3634c0518507d5d817be6dab6233ebe4d68d9"
					"0x81e1f62d4f5722daa0c2f87137228d0b59516aba"
					"0xff936b80783b32ad3f2b4e610d04c9778c4669a0"
					"0x8314125c8b68af2afd0d151eb4a551e88128a2ae"
					"0x9841484a4a6c0b61c4eea71376d76453fd05ec9c"
					"0xc922f4CDe42dD658A7D3EA852caF7Eae47F6cEcd"
					"0xBaaC5464BF6E767C9af0E8d4677C01Be2065fd5F"
					"0x43D19841D818B2ccC63a8B44Ce8C7DEF8616D98E"
					"0xb484027CB0c538538Bad2bE492714154f9196F93"
					"0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F"
					"0x43318DE9E8f65b591598F17aDD87ae7247649C83"
					"0x8285047F33c26c1Bf5B387f2b07F21A2aF29Ace2"
				]
			}
		) {
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
					total
					spread
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
		positionBalances(
			first: $firstSingle
			skip: $skipSingle
			where: {
				account_not_in: [
					"0x82b3634c0518507d5d817be6dab6233ebe4d68d9"
					"0x81e1f62d4f5722daa0c2f87137228d0b59516aba"
					"0xff936b80783b32ad3f2b4e610d04c9778c4669a0"
					"0x8314125c8b68af2afd0d151eb4a551e88128a2ae"
					"0x9841484a4a6c0b61c4eea71376d76453fd05ec9c"
					"0xc922f4CDe42dD658A7D3EA852caF7Eae47F6cEcd"
					"0xBaaC5464BF6E767C9af0E8d4677C01Be2065fd5F"
					"0x43D19841D818B2ccC63a8B44Ce8C7DEF8616D98E"
					"0xb484027CB0c538538Bad2bE492714154f9196F93"
					"0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F"
					"0x43318DE9E8f65b591598F17aDD87ae7247649C83"
					"0x8285047F33c26c1Bf5B387f2b07F21A2aF29Ace2"
				]
			}
		) {
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
					spread
					total
					maturityDate
					gameId
				}
			}
		}
	}
`
export const GET_MATCH_DETAIL = gql`
	query getMatch($gameId: String!) {
		sportMarkets(where: { gameId: $gameId }) {
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
			homeOdds
			awayOdds
			drawOdds
			doubleChanceMarketType
		}
	}
`
