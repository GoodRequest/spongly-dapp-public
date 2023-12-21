import React, { useEffect, useState } from 'react'
import { useRouter } from 'next-translate-routes'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useNetwork } from 'wagmi'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'

// utils
import { GET_PARLAY_DETAIL, GET_POSITION_BALANCE_DETAIL, GET_POSITION_BALANCE_TRANSACTION } from '@/utils/queries'
import {
	assignOtherAttrsToUserTicket,
	getPositionsWithMergedCombinedPositions,
	orderPositionsAsSportMarkets,
	parseParlayToUserTicket,
	parsePositionBalanceToUserTicket
} from '@/utils/helpers'
import networkConnector from '@/utils/networkConnector'
import { MSG_TYPE, Network, NETWORK_IDS, NOTIFICATION_TYPE } from '@/utils/constants'

// hooks
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'

// types
import { SGPItem, UserTicket } from '@/typescript/types'

// components
import PositionsList from '@/components/positionsList/PositionsList'
import Custom404 from '@/pages/404'
import { showNotifications } from '@/utils/tsxHelpers'
import * as SC from '@/content/matchesContent/MatchDetailContentStyles'

const TicketDetailContent = () => {
	const { chain } = useNetwork()
	const router = useRouter()
	const { address } = useAccount()
	const { signer } = networkConnector
	const { t } = useTranslation()

	const [fetchParlayDetail] = useLazyQuery(GET_PARLAY_DETAIL)
	const [fetchPositionDetail] = useLazyQuery(GET_POSITION_BALANCE_DETAIL)
	const [fetchPositionBalanceMarketTransactions] = useLazyQuery(GET_POSITION_BALANCE_TRANSACTION)

	const [positionsData, setPositionsData] = useState<any>()
	const [ticketData, setTicketData] = useState<UserTicket>()
	const [isLoading, setIsLoading] = useState(true)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const [error, setError] = useState(false)

	const sgpFeesRaw = useSGPFeesQuery((chain?.id as Network) || NETWORK_IDS.OPTIMISM, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	const fetchData = async () => {
		try {
			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate a delay
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
				setPositionsData(positionsWithMergedCombinedPositions)
			})
		} catch (e) {
			setError(true)
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading detail of ticket') }], NOTIFICATION_TYPE.NOTIFICATION)
			// eslint-disable-next-line no-console
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

	const renderTicketDetail =
		!(positionsData && ticketData) || isLoading ? (
			<Row gutter={[0, 16]}>
				<Col span={24}>
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
				</Col>
				<Col span={24}>
					<SC.RowSkeleton active loading paragraph={{ rows: 3 }} />
				</Col>
				<Col span={24}>
					<SC.RowSkeleton active loading paragraph={{ rows: 3 }} />
				</Col>
				<Col span={24}>
					<SC.RowSkeleton active loading paragraph={{ rows: 3 }} />
				</Col>
				<Col span={24}>
					<SC.RowSkeleton active loading paragraph={{ rows: 3 }} />
				</Col>
			</Row>
		) : (
			positionsData &&
			ticketData &&
			!isLoading && (
				<Row>
					<Col span={24}>
						<PositionsList
							isMyWallet={isMyWallet}
							ticketData={ticketData}
							positionsWithCombinedAttrs={positionsData}
							marketQuotes={ticketData?.marketQuotes}
						/>
					</Col>
				</Row>
			)
		)

	return error ? <Custom404 /> : renderTicketDetail
}

export default TicketDetailContent
