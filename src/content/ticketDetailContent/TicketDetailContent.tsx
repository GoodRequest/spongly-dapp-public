import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'
import { useLazyQuery } from '@apollo/client'
import { useNetwork } from 'wagmi'
import { Col, Row, Spin } from 'antd'
import { GET_PARLAY_DETAIL, GET_POSITION_BALANCE_DETAIL, GET_POSITION_BALANCE_TRANSACTION } from '@/utils/queries'
import {
	assignOtherAttrsToUserTicket,
	getPositionsWithMergedCombinedPositions,
	orderPositionsAsSportMarkets,
	parseParlayToUserTicket,
	parsePositionBalanceToUserTicket
} from '@/utils/helpers'
import { SGPItem, UserTicket } from '@/typescript/types'
import networkConnector from '@/utils/networkConnector'
import BackButton from '@/atoms/backButton/BackButton'
import { PAGES } from '@/utils/enums'
import TicketStatisticRow from '@/components/statisticRow/TicketStatisticRow'
import { roundPrice } from '@/utils/formatters/currency'

import * as PSC from '@/layout/content/ContentStyles'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import PositionsList from '@/components/positionsList/PositionsList'
import { Network } from '@/utils/constants'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { formatPositionOdds } from '@/utils/formatters/quote'

const TicketDetailContent = () => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const router = useRouter()
	const { signer } = networkConnector
	const [fetchParlayDetail] = useLazyQuery(GET_PARLAY_DETAIL)
	const [fetchPositionDetail] = useLazyQuery(GET_POSITION_BALANCE_DETAIL)
	const [fetchPositionBalanceMarketTransactions] = useLazyQuery(GET_POSITION_BALANCE_TRANSACTION)
	const [positionsData, setPositionsData] = useState<any>()
	const [ticketData, setTicketData] = useState<UserTicket>()
	const [quote, setQuote] = useState<any>()

	const [isLoading, setIsLoading] = useState(false)

	const [sgpFees, setSgpFees] = useState<SGPItem[]>()

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	const fetchData = async (isParlay: boolean) => {
		try {
			let userTicket
			let marketData
			if (isParlay) {
				const { data } = await fetchParlayDetail({
					variables: { id: router.query.ticketId },
					context: { chainId: chain?.id }
				})
				userTicket = parseParlayToUserTicket(data?.parlayMarket)
			} else {
				const { data: positionDetailData } = await fetchPositionDetail({
					variables: { id: router.query.ticketId },
					context: { chainId: chain?.id }
				})
				userTicket = parsePositionBalanceToUserTicket(positionDetailData?.positionBalance)

				const { data: marketTransactionsData } = await fetchPositionBalanceMarketTransactions({
					variables: { id: userTicket.id },
					context: { chainId: chain?.id }
				})
				marketData = marketTransactionsData.marketTransactions
			}

			assignOtherAttrsToUserTicket([userTicket], marketData, chain?.id, signer).then((ticketsWithOtherAttrs) => {
				// NOTE: always just one ticket
				const orderedPositions = orderPositionsAsSportMarkets(ticketsWithOtherAttrs?.[0])

				const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticketsWithOtherAttrs?.[0], sgpFees)
				setTicketData(ticketsWithOtherAttrs?.[0])
				setPositionsData(positionsWithMergedCombinedPositions)
				let quote: undefined | number
				positionsWithMergedCombinedPositions?.forEach((item, index) => {
					if (isParlay) {
						if (!quote) {
							quote = item?.isCombined ? item?.odds : Number(ticketsWithOtherAttrs?.[0]?.marketQuotes?.[index])
						} else {
							// eslint-disable-next-line
							// @ts-ignore
							quote *= item?.isCombined ? item.odds : Number(ticketsWithOtherAttrs?.[0].marketQuotes?.[index])
						}
					} else if (!quote) {
						// eslint-disable-next-line
							// @ts-ignore
						quote = item?.isCombined ? item?.odds : formatPositionOdds(item)
					} else {
						// eslint-disable-next-line
						// @ts-ignore
						quote *= item?.isCombined ? item.odds : formatPositionOdds(item)
					}
				})
				setQuote(quote)
			})
		} catch (e) {
			// TODO: throw notif
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (router.query.ticketId) {
			setIsLoading(true)
			if (router.query.ticketId.includes('-')) {
				fetchData(false)
			} else {
				fetchData(true)
			}
		}
		// else {
		// 	NOTE: redirect to 404?
		// }

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.ticketId])

	return (
		<>
			<Row gutter={[0, 16]}>
				<Col span={24}>
					{/* TODO: redirect to Tickets / My-Wallet / Tipster-detail */}
					<BackButton backUrl={router?.query?.previousPath ? (router.query.previousPath as string) : `/${PAGES.TICKETS}`} />
				</Col>
				{isLoading ? (
					<Spin />
				) : (
					<Col span={24}>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								{
									<TicketStatisticRow
										isLoading={isLoading}
										tipsterAddress={ticketData?.account || ''}
										buyIn={roundPrice(ticketData?.sUSDPaid, true)}
										// changes if ticket type
										claim={roundPrice(positionsData?.amount || 0, true)}
										quote={quote}
										matches={positionsData?.length}
									/>
								}
							</Col>
						</Row>
					</Col>
				)}
			</Row>
			<Row>
				<PSC.MainContentContainer>
					{positionsData ? <PositionsList positionsWithCombinedAttrs={positionsData} /> : <div>Is empty</div>}
				</PSC.MainContentContainer>
				<PSC.MobileHiddenCol span={8}>
					<TicketBetContainer />
				</PSC.MobileHiddenCol>
			</Row>
		</>
	)
}

export default TicketDetailContent
