import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useAccount, useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { includes } from 'lodash'
import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { useIsMounted } from '@/hooks/useIsMounted'
import { getWalletImage } from '@/utils/images'
import { roundPrice } from '@/utils/formatters/currency'

import SuccessRateIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsTicketsIcon from '@/assets/icons/stat-profits-icon.svg'
import TicketsIcon from '@/assets/icons/stat-balance-icon.svg'
import { PAGES } from '@/utils/enums'
import { formatTicketPositionsForStatistics, getUserTicketType } from '@/utils/helpers'
import { MSG_TYPE, NETWORK_IDS, NOTIFICATION_TYPE, USER_TICKET_TYPE } from '@/utils/constants'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { showNotifications } from '@/utils/tsxHelpers'

interface IStatistics {
	successRate: number
	trades: number
	pnl: number
}

const UserStatisticRow = () => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { address } = useAccount()
	const isMounted = useIsMounted()
	const router = useRouter()
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)
	const userStatistics = [`/${PAGES.MY_WALLET}`, `/${PAGES.TIPSTER_DETAIL}`]
	const isMyWallet = !router.query.id
	const [statistics, setStatistics] = useState<IStatistics>()
	const [isLoading, setIsLoading] = useState(false)
	const id = isMyWallet ? address?.toLocaleLowerCase() : String(router.query.id).toLowerCase()

	const fetchStats = async () => {
		try {
			setIsLoading(true)
			const { data } = await fetchUserStatistic({ variables: { id }, context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM } })
			const formattedTicketData = formatTicketPositionsForStatistics({ parlayMarkets: data.parlayMarkets, positionBalances: data.positionBalances })
			const wonTickets = [...formattedTicketData.parlayTickets, ...formattedTicketData.positionTickets]?.filter(
				(item) => getUserTicketType(item) === USER_TICKET_TYPE.SUCCESS
			)
			const lostTickets = [...formattedTicketData.parlayTickets, ...formattedTicketData.positionTickets]?.filter(
				(item) => getUserTicketType(item) === USER_TICKET_TYPE.MISS
			)
			const numberOfAttempts = wonTickets.length + lostTickets.length
			let successRate = 0.0
			if (wonTickets.length !== 0) {
				successRate = Number(((wonTickets.length / numberOfAttempts) * 100).toFixed(2))
			}
			setStatistics({ ...data.user, successRate })
			setIsLoading(false)
		} catch (e) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading detail of tipster') }], NOTIFICATION_TYPE.NOTIFICATION)
			setIsLoading(false)
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	const showUserStatistics = () => {
		if (chain?.id) return true
		if (!chain?.id && isMyWallet) return false
		if (!chain?.id && !isMyWallet) return true
		return false
	}

	useEffect(() => {
		if (router.isReady && isMounted && showUserStatistics()) {
			fetchStats()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, isMounted, chain?.id, id])

	return (
		<Row gutter={[0, 32]}>
			{includes(userStatistics, router.pathname) && showUserStatistics() ? (
				<>
					<Col lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(address as string)}
							filled={true}
							isAddress={true}
							value={isMounted ? (isMyWallet ? address : String(router.query.id) || '') : ''}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
							isMyWallet={isMyWallet}
						/>
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							showMobileInColumn={true}
							isLoading={isLoading}
							img={SuccessRateIcon}
							value={isMounted ? `${statistics?.successRate ? statistics.successRate : 0} %` : ''}
							title={t('Success rate')}
						/>
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							img={ProfitsTicketsIcon}
							value={isMounted ? `${statistics?.pnl && statistics?.pnl > 0 ? '+' : ''}${roundPrice(statistics?.pnl, false)} $` : ''}
							title={t('Profits')}
						/>
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							img={TicketsIcon}
							value={isMounted ? (statistics?.trades ? statistics.trades : 0) : 0}
							title={t('Tickets')}
						/>
					</Col>
				</>
			) : null}
		</Row>
	)
}

export default UserStatisticRow
