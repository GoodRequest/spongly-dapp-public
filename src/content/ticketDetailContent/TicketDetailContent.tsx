import React, { useEffect, useState } from 'react'
import { useRouter } from 'next-translate-routes'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useNetwork } from 'wagmi'
import { Col, Row } from 'antd'

// utils
import { GET_PARLAY_DETAIL, GET_POSITION_BALANCE_DETAIL, GET_POSITION_BALANCE_TRANSACTION } from '@/utils/queries'
import {
	assignOtherAttrsToUserTicket,
	getPositionsWithMergedCombinedPositions,
	getTicketHistoricQuote,
	getUserTicketClaimValue,
	getUserTicketType,
	isWindowReady,
	orderPositionsAsSportMarkets,
	parseParlayToUserTicket,
	parsePositionBalanceToUserTicket
} from '@/utils/helpers'
import networkConnector from '@/utils/networkConnector'
import { roundPrice } from '@/utils/formatters/currency'
import { Network, OddsType, USER_TICKET_TYPE } from '@/utils/constants'

// hooks
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'

// types
import { SGPItem, UserTicket } from '@/typescript/types'

// components
import TicketStatisticRow from '@/components/statisticRow/TicketStatisticRow'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import PositionsList from '@/components/positionsList/PositionsList'
import Custom404 from '@/pages/404'

// styles
import * as PSC from '@/layout/content/ContentStyles'

const TicketDetailContent = () => {
	const { chain } = useNetwork()
	const router = useRouter()
	const { address } = useAccount()
	const { signer } = networkConnector

	const [fetchParlayDetail] = useLazyQuery(GET_PARLAY_DETAIL)
	const [fetchPositionDetail] = useLazyQuery(GET_POSITION_BALANCE_DETAIL)
	const [fetchPositionBalanceMarketTransactions] = useLazyQuery(GET_POSITION_BALANCE_TRANSACTION)

	const [positionsData, setPositionsData] = useState<any>()
	const [ticketData, setTicketData] = useState<UserTicket>()
	const [userTicketType, setUserTicketType] = useState<USER_TICKET_TYPE | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()

	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	const fetchData = async () => {
		try {
			setIsLoading(true)
			let isParlay = true
			if (router.query.ticketId?.includes('-')) {
				isParlay = false
			}

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
				setUserTicketType(getUserTicketType(ticketsWithOtherAttrs?.[0]))
				setPositionsData(positionsWithMergedCombinedPositions)
			})
		} catch (e) {
			// TODO: throw notif
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (router.isReady) {
			fetchData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady])

	const isMyWallet = ticketData?.account?.toLocaleLowerCase() === address?.toLocaleLowerCase()

	return (
		<>
			{(positionsData || isLoading) && (
				<Row gutter={[0, 16]}>
					<Col span={24}>
						<TicketStatisticRow
							isLoading={isLoading}
							tipsterAddress={ticketData?.account || ''}
							buyIn={roundPrice(ticketData?.sUSDPaid, true)}
							userTicketType={userTicketType}
							claim={getUserTicketClaimValue(ticketData, userTicketType)}
							quote={getTicketHistoricQuote(positionsData, actualOddType, ticketData?.marketQuotes)}
							matches={positionsData?.length}
							txHash={ticketData?.txHash}
							isMyWallet={isMyWallet}
						/>
					</Col>
				</Row>
			)}
			<Row style={{ marginTop: '16px' }}>
				<PSC.MainContentContainer withPadding={true}>
					{positionsData || isLoading ? (
						<PositionsList
							isMyWallet={isMyWallet}
							ticketData={ticketData}
							positionsWithCombinedAttrs={positionsData}
							marketQuotes={ticketData?.marketQuotes}
						/>
					) : (
						<div style={{ marginTop: '-16px' }}>
							<Custom404 />
						</div>
					)}
				</PSC.MainContentContainer>
				<PSC.MobileHiddenCol span={8}>
					<TicketBetContainer />
				</PSC.MobileHiddenCol>
			</Row>
		</>
	)
}

export default TicketDetailContent
