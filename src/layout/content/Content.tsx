import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useRouter } from 'next-translate-routes'
import { includes } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useBalance, useNetwork } from 'wagmi'

import * as SC from './ContentStyles'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import ParlayLeaderboard from '@/components/parlayLeaderboard/ParlayLeaderboard'
import { PAGES } from '@/utils/enums'
import SBox from '@/components/sBox/SBox'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { roundPrice } from '@/utils/formatters/currency'
import { formatTicketPositionsForStatistics, getUserTicketType } from '@/utils/helpers'
import { USER_TICKET_TYPE } from '@/utils/constants'
import SuccessIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsIcon from '@/assets/icons/stat-profits-icon.svg'
import BalanceIcon from '@/assets/icons/stat-balance-icon.svg'

import Button from '@/atoms/button/Button'
import { useIsMounted } from '@/hooks/useIsMounted'
import { StatsOverlayWrapper } from './ContentStyles'

interface ILayout {
	children: ReactNode
}

interface IStatistics {
	successRate: number
	trades: number
	pnl: number
}
const Content: FC<ILayout> = ({ children }) => {
	const router = useRouter()
	const { id } = router.query
	const { t } = useTranslation()
	const fullWidthPages = [`/${PAGES.PARLAY_SUPERSTARS}`, `/${PAGES.LEADERBOARD}`]
	const userStatistics = [`/${PAGES.DASHBOARD}`]
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)
	const { address } = useAccount()
	const { chain } = useNetwork()
	const [statistics, setStatistics] = useState<IStatistics>()
	const [isLoading, setIsLoading] = useState(false)
	const isMounted = useIsMounted()

	const { data } = useBalance({
		address
	})

	const fetchStats = async () => {
		try {
			setIsLoading(true)
			const { data } = await fetchUserStatistic({ variables: { id: address?.toLocaleLowerCase() }, context: { chainId: chain?.id } })
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
			setIsLoading(false)
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	useEffect(() => {
		if (chain?.id && isMounted) {
			fetchStats()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id, isMounted])

	return (
		<SC.MainContainer>
			{chain?.id && isMounted && (
				<SC.StatsWrapper>
					{includes(userStatistics, router.pathname) ? (
						isLoading ? (
							<StatsOverlayWrapper>
								<Col span={12} xs={6} md={12} xl={6}>
									<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								</Col>
								<Col span={12} xs={6} md={12} xl={6}>
									<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								</Col>
								<Col span={12} xs={6} md={12} xl={6}>
									<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								</Col>
								<Col span={12} xs={6} md={12} xl={6}>
									<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								</Col>
							</StatsOverlayWrapper>
						) : (
							!isLoading &&
							statistics && (
								<SC.StatsOverlayWrapper>
									<Col span={12} xs={6} md={12} xl={6}>
										<SBox
											title={t('Account balance')}
											value={`${Number(data?.formatted).toFixed(4)} ${data?.symbol}`}
											extraContent={<img src={BalanceIcon} alt={'stat'} />}
										/>
									</Col>
									<Col span={12} xs={6} md={12} xl={6}>
										<SBox
											title={t('Profits')}
											value={`${roundPrice(statistics?.pnl)} $`}
											extraContent={<img src={ProfitsIcon} alt={'stat'} />}
										/>
									</Col>
									<Col span={12} xs={6} md={12} xl={6}>
										<SBox
											title={t('Success rate')}
											value={statistics.successRate ? `${statistics.successRate} %` : '-'}
											extraContent={<img src={SuccessIcon} alt={'stat'} />}
										/>
									</Col>
									<Col span={12} xs={6} md={12} xl={6}>
										<SBox
											title={t('My tickets')}
											value={statistics.trades || 0}
											extraContent={
												<Button btnStyle={'primary'} onClick={() => router.push(`/${PAGES.MY_WALLET}`)} content={t('Show all')} />
											}
										/>
									</Col>
								</SC.StatsOverlayWrapper>
							)
						)
					) : null}
				</SC.StatsWrapper>
			)}

			<Row gutter={[30, 30]} style={{ display: 'flex', justifyContent: 'space-between' }}>
				{includes(fullWidthPages, router.pathname) && !id ? (
					<Col style={{ width: '100%' }} lg={24} xl={24}>
						{children}
					</Col>
				) : (
					<>
						<SC.MainContentContainer>{children}</SC.MainContentContainer>
						<SC.MobileHiddenCol span={8}>
							{router.pathname === `/${PAGES.DASHBOARD}` && <ParlayLeaderboard />}
							<TicketBetContainer />
						</SC.MobileHiddenCol>
					</>
				)}
			</Row>
		</SC.MainContainer>
	)
}

export default Content
