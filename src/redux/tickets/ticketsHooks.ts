import { useEffect } from 'react'
import { ApolloError, useLazyQuery } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { useNetwork } from 'wagmi'

import { TICKET_LIST } from '@/redux/tickets/ticketType'

// components
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'

// types
import { ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'

// utils
import { GET_TICKETS } from '@/utils/queries'
import {
	fetchSuccessRate,
	getClosedTicketType,
	getTicketTotalQuote,
	getTicketType,
	isWindowReady,
	removeDuplicatesByGameId,
	removeDuplicateSubstring
} from '@/utils/helpers'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { ITicket } from '@/typescript/types'
import { OddsType } from '@/utils/constants'

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
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

	const mapTicketsData = async (data: (ParlayMarket | PositionBalance)[], successRateMap: Map<string, number>) =>
		data.map((ticket) => {
			return {
				ticket: {
					...ticket,
					ticketType: getTicketType(ticket),
					closedTicketType: getClosedTicketType(ticket),
					buyIn: ticket?.sUSDPaid ? Number(bigNumberFormatter(ticket.sUSDPaid as string)) : 0,
					matchesCount: 'positions' in ticket ? removeDuplicatesByGameId(ticket.positions) : 1,
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
					successRate: successRateMap.get(ticket.account) || 0,
					totalTicketQuote: Number(getTicketTotalQuote(ticket as ITicket, actualOddType, 'positions' in ticket ? ticket.totalQuote : undefined))
				}
			} as ITicketContent
		})

	const fetchAllTickets = async () => {
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
			fetchSuccessRate(chain?.id)
		])
			.then((values) => {
				const allTickets = [
					...values[0].data.parlayMarkets,
					...values[0].data.positionBalances,
					...values[1].data.parlayMarkets,
					...values[1].data.positionBalances,
					...values[2].data.parlayMarkets,
					...values[2].data.positionBalances
				]

				const successRateMap = new Map(values[3].map((obj) => [obj.ac, obj.sr]))

				mapTicketsData(allTickets, successRateMap).then((data) => {
					dispatch({
						type: TICKET_LIST.TICKET_LIST_LOAD_DONE,
						payload: { data }
					})
				})
			})
			.catch(() => {
				dispatch({
					type: TICKET_LIST.TICKET_LIST_LOAD_FAIL,
					payload: { data: [] }
				})
			})
	}

	useEffect(() => {
		fetchAllTickets()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id, actualOddType])

	return null
}

export default useFetchTickets
