import { useEffect } from 'react'
import { ApolloError, useLazyQuery } from '@apollo/client'
import { groupBy } from 'lodash'
import { useDispatch } from 'react-redux'
import { useNetwork } from 'wagmi'

import { TICKET_LIST } from '@/redux/tickets/ticketType'

import successRateData from '@/assets/stats.json'
// components
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'

// types
import { ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'

// utils
import { GET_TICKETS } from '@/utils/queries'
import {
	getClosedTicketType,
	getSuccessRateForTickets,
	getTicketTotalQuote,
	getTicketType,
	removeDuplicatesByGameId,
	removeDuplicateSubstring
} from '@/utils/helpers'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { ITicket } from '@/typescript/types'

export interface IDefaultProps {
	loading: boolean
	error: ApolloError | undefined | boolean
}

const BATCH_SIZE = 1000
const INITIAL_BATCH_SIZE = 10

const useFetchTickets = () => {
	const dispatch = useDispatch()

	const { chain } = useNetwork()
	// Apollo fetch data
	const [fetchTicketsData0] = useLazyQuery(GET_TICKETS)
	const [fetchTicketsData1] = useLazyQuery(GET_TICKETS)
	const [fetchTicketsData2] = useLazyQuery(GET_TICKETS)
	const [fetchTicketsData3] = useLazyQuery(GET_TICKETS)
	const [fetchTicketsData4] = useLazyQuery(GET_TICKETS)
	const [fetchTicketsData5] = useLazyQuery(GET_TICKETS)

	const getSuccessRateMap = (data: ParlayMarket[]) => {
		const walletSuccessRateMap = new Map()
		const usersTickets = groupBy(data, 'account')
		Object.entries(usersTickets).forEach(([key, value]) => walletSuccessRateMap.set(key, getSuccessRateForTickets(value)))
		return walletSuccessRateMap
	}

	const mapTicketsData = (data: (ParlayMarket | PositionBalance)[]): ITicketContent[] => {
		return data.map((ticket) => {
			return {
				ticket: {
					...ticket,
					ticketType: getTicketType(ticket),
					closedTicketType: getClosedTicketType(ticket),
					buyIn: ticket?.sUSDPaid ? Number(bigNumberFormatter(ticket.sUSDPaid as string)) : 0,
					matches: 'positions' in ticket ? removeDuplicatesByGameId(ticket.positions) : 1,
					positions:
						'positions' in ticket
							? ticket.positions.map((item) => {
									return {
										...item,
										market: {
											...item.market,
											homeTeam: removeDuplicateSubstring(item.market.homeTeam),
											awayTeam: removeDuplicateSubstring(item.market.awayTeam)
										}
									}
							  })
							: [ticket.position].map((item) => {
									return {
										...item,
										market: {
											...item.market,
											homeTeam: removeDuplicateSubstring(item.market.homeTeam),
											awayTeam: removeDuplicateSubstring(item.market.awayTeam)
										}
									}
							  }),
					successRate: successRateData.stats.filter((item) => item.account === ticket.account)[0]?.successRate || 0,
					totalTicketQuote: Number(getTicketTotalQuote(ticket as ITicket, 'positions' in ticket ? ticket.totalQuote : undefined))
				}
			} as ITicketContent
		})
	}

	const fetchAllTickets = () => {
		dispatch({ type: TICKET_LIST.TICKET_LIST_LOAD_START })
		const ticketQueryProps = { firstParlay: BATCH_SIZE, firstSingle: BATCH_SIZE }
		Promise.all([
			fetchTicketsData0({
				variables: {
					skipParlay: INITIAL_BATCH_SIZE,
					firstParlay: BATCH_SIZE - INITIAL_BATCH_SIZE,
					skipSingle: INITIAL_BATCH_SIZE,
					firstSingle: BATCH_SIZE - INITIAL_BATCH_SIZE
				},
				context: { chainId: chain?.id }
			}),
			fetchTicketsData1({
				variables: {
					...ticketQueryProps,
					skipParlay: 1 * BATCH_SIZE,
					skipSingle: 1 * BATCH_SIZE
				},
				context: { chainId: chain?.id }
			}),
			fetchTicketsData2({
				variables: {
					...ticketQueryProps,
					skipParlay: 2 * BATCH_SIZE,
					skipSingle: 2 * BATCH_SIZE
				},
				context: { chainId: chain?.id }
			}),
			fetchTicketsData3({
				variables: {
					...ticketQueryProps,
					skipParlay: 3 * BATCH_SIZE,
					skipSingle: 3 * BATCH_SIZE
				},
				context: { chainId: chain?.id }
			}),
			fetchTicketsData4({
				variables: {
					...ticketQueryProps,
					skipParlay: 4 * BATCH_SIZE,
					skipSingle: 4 * BATCH_SIZE
				},
				context: { chainId: chain?.id }
			}),
			fetchTicketsData5({
				variables: {
					...ticketQueryProps,
					skipParlay: 5 * BATCH_SIZE,
					skipSingle: 5 * BATCH_SIZE
				},
				context: { chainId: chain?.id }
			})
		])
			.then((values) => {
				const allTickets = [
					...values[0].data.parlayMarkets,
					...values[0].data.positionBalances,
					...values[1].data.parlayMarkets,
					...values[1].data.positionBalances,
					...values[2].data.parlayMarkets,
					...values[2].data.positionBalances,
					...values[3].data.parlayMarkets,
					...values[3].data.positionBalances,
					...values[4].data.parlayMarkets,
					...values[4].data.positionBalances,
					...values[5].data.parlayMarkets,
					...values[5].data.positionBalances
				]
				dispatch({
					type: TICKET_LIST.TICKET_LIST_LOAD_DONE,
					payload: { data: mapTicketsData(allTickets) }
				})
			})
			.catch(() => {
				dispatch({
					type: TICKET_LIST.TICKET_LIST_LOAD_DONE,
					payload: { data: [], successRateMap: new Map() }
				})
			})
	}

	useEffect(() => {
		fetchAllTickets()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id])

	return null
}

export default useFetchTickets
