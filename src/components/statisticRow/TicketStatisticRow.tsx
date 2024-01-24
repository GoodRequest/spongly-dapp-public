import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount, useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { includes } from 'lodash'
import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { getWalletImage } from '@/utils/images'
import { MSG_TYPE, Network, NETWORK_IDS, NOTIFICATION_TYPE, OddsType, USER_TICKET_TYPE } from '@/utils/constants'
import {
	assignOtherAttrsToUserTicket,
	getPositionsWithMergedCombinedPositions,
	getTicketHistoricQuote,
	getUserTicketClaimValue,
	getUserTicketType,
	handleTxHashRedirect,
	isWindowReady,
	orderPositionsAsSportMarkets,
	parseParlayToUserTicket,
	parsePositionBalanceToUserTicket
} from '@/utils/helpers'
import { PAGES } from '@/utils/enums'
import { SGPItem, UserTicket } from '@/typescript/types'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { showNotifications } from '@/utils/tsxHelpers'
import { GET_PARLAY_DETAIL, GET_POSITION_BALANCE_DETAIL, GET_POSITION_BALANCE_TRANSACTION } from '@/utils/queries'
import networkConnector from '@/utils/networkConnector'
import { roundPrice } from '@/utils/formatters/currency'

const TicketStatisticRow = () => {
	const { chain } = useNetwork()
	const router = useRouter()
	const { address } = useAccount()
	const { signer } = networkConnector
	const { t } = useTranslation()

	const [userTicketType, setUserTicketType] = useState<USER_TICKET_TYPE | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const [fetchParlayDetail] = useLazyQuery(GET_PARLAY_DETAIL)
	const [fetchPositionDetail] = useLazyQuery(GET_POSITION_BALANCE_DETAIL)
	const [fetchPositionBalanceMarketTransactions] = useLazyQuery(GET_POSITION_BALANCE_TRANSACTION)
	const [positionsData, setPositionsData] = useState<any>()
	const [ticketData, setTicketData] = useState<UserTicket>()
	const claim = getUserTicketClaimValue(ticketData, userTicketType)
	const [error, setError] = useState(false)

	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL

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
					context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM }
				})
				userTicket = parseParlayToUserTicket(data?.parlayMarket)
			} else {
				const { data: positionDetailData } = await fetchPositionDetail({
					variables: { id: router.query.ticketId },
					context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM }
				})
				userTicket = parsePositionBalanceToUserTicket(positionDetailData?.positionBalance)

				const { data: marketTransactionsData } = await fetchPositionBalanceMarketTransactions({
					variables: { id: userTicket.id },
					context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM }
				})
				marketData = marketTransactionsData.marketTransactions
			}

			assignOtherAttrsToUserTicket([userTicket], marketData, chain?.id || NETWORK_IDS.OPTIMISM, signer).then((ticketsWithOtherAttrs) => {
				// NOTE: always just one ticket
				const orderedPositions = orderPositionsAsSportMarkets(ticketsWithOtherAttrs?.[0])

				const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticketsWithOtherAttrs?.[0], sgpFees)
				setTicketData(ticketsWithOtherAttrs?.[0])
				setUserTicketType(getUserTicketType(ticketsWithOtherAttrs?.[0]))
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
	const userStatistics = [`/${PAGES.TICKET_DETAIL}`]

	return (
		<Row gutter={[8, 12]}>
			{includes(userStatistics, router.pathname) && !error ? (
				<>
					<Col lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(ticketData?.account as string)}
							filled={true}
							isAddress={true}
							isLoading={isLoading}
							onClick={() => router.push(`/${PAGES.TIPSTER_DETAIL}/?id=${ticketData?.account}`)}
							value={ticketData?.account || ''}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
							isMyWallet={isMyWallet}
						/>
					</Col>
					<Col lg={4} md={24} sm={24} xs={24}>
						<StatisticCard
							showMobileInColumn={true}
							isTxnHash={true}
							isLoading={isLoading}
							value={ticketData?.txHash}
							title={t('Txn hash')}
							addMobileBackground={true}
							onClick={() => handleTxHashRedirect(t, ticketData?.txHash, chain?.id || NETWORK_IDS.OPTIMISM)}
						/>
					</Col>
					<Col lg={4} md={12} sm={12} xs={12}>
						<StatisticCard
							showMobileInColumn={true}
							isLoading={isLoading}
							value={roundPrice(ticketData?.sUSDPaid, true)}
							title={t('Buy-in')}
							addMobileBackground={true}
						/>
					</Col>
					<Col lg={3} md={12} sm={12} xs={12}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							value={getTicketHistoricQuote(positionsData, actualOddType, ticketData?.marketQuotes)}
							title={t('Quote')}
							addMobileBackground={true}
						/>
					</Col>
					<Col lg={3} md={12} sm={12} xs={12}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							value={positionsData?.length}
							title={t('Matches')}
							addMobileBackground={true}
						/>
					</Col>
					<Col lg={4} md={12} sm={12} xs={12}>
						<StatisticCard
							colorValue={userTicketType === USER_TICKET_TYPE.SUCCESS ? 'green' : userTicketType === USER_TICKET_TYPE.MISS ? 'red' : 'default'}
							isLoading={isLoading}
							showMobileInColumn={true}
							value={claim}
							title={t('Claim')}
							addMobileBackground={true}
						/>
					</Col>
				</>
			) : null}
		</Row>
	)
}

export default TicketStatisticRow
