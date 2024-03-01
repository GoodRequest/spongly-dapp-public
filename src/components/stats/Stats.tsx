import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { useTranslation } from 'next-export-i18n'
import { includes } from 'lodash'
import { useRouter } from 'next-translate-routes'
import { Col } from 'antd'
import { useTheme } from 'styled-components'

import { formatTicketPositionsForStatistics, getProfit, getUserTicketType } from '@/utils/helpers'
import { USER_TICKET_TYPE } from '@/utils/constants'
import { PAGES } from '@/utils/enums'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { useIsMounted } from '@/hooks/useIsMounted'
import * as SC from './StatsStyles'
import SBox from '@/components/sBox/SBox'
import SuccessIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsIcon from '@/assets/icons/stat-profits-icon.svg'
import BalanceIcon from '@/assets/icons/stat-balance-icon.svg'
import Button from '@/atoms/button/Button'

interface IStatistics {
	successRate: number
	trades: number
	pnl: number
}

const Stats = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const userStatistics = [`/${PAGES.DASHBOARD}`]
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)
	const { address } = useAccount()
	const { chain } = useNetwork()
	const [statistics, setStatistics] = useState<IStatistics>()
	const [isLoading, setIsLoading] = useState(false)
	const isMounted = useIsMounted()
	const theme = useTheme()

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
			const cancelledTickets = [...formattedTicketData.parlayTickets, ...formattedTicketData.positionTickets]?.filter(
				(item) => getUserTicketType(item) === USER_TICKET_TYPE.CANCELED
			)
			const numberOfAttempts = wonTickets.length + lostTickets.length
			let successRate = 0.0
			if (wonTickets.length !== 0) {
				successRate = Number(((wonTickets.length / numberOfAttempts) * 100).toFixed(2))
			}
			const profit = getProfit(wonTickets, lostTickets, cancelledTickets, chain?.id)
			setStatistics({ ...data.user, pnl: Number(profit), successRate })
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
		<SC.StatsWrapper hide={!includes(userStatistics, router.pathname) || !chain?.id}>
			{includes(userStatistics, router.pathname) && chain?.id ? (
				isLoading ? (
					<SC.StatsOverlayWrapper>
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
					</SC.StatsOverlayWrapper>
				) : (
					!isLoading &&
					statistics && (
						<SC.StatsOverlayWrapper>
							<Col span={12} xs={6} md={12} xl={6}>
								<SBox
									title={t('Account balance')}
									value={`${Number(data?.formatted).toFixed(4)} ${data?.symbol}`}
									extraContent={
										<div>
											<SC.Glow $color={theme['color-base-action-primary-default']} />
											<SC.StatImage src={BalanceIcon} alt={'stat'} />
										</div>
									}
								/>
							</Col>
							<Col span={12} xs={6} md={12} xl={6}>
								<SBox
									title={t('Profits')}
									value={`${(statistics.pnl || 0) > 0 ? '+' : ''}${statistics.pnl} $`}
									extraContent={
										<div>
											<SC.Glow $color={theme['color-base-state-success-fg']} />
											<SC.StatImage src={ProfitsIcon} alt={'stat'} />
										</div>
									}
								/>
							</Col>
							<Col span={12} xs={6} md={12} xl={6}>
								<SBox
									title={t('Win rate')}
									value={statistics.successRate ? `${statistics.successRate} %` : '-'}
									extraContent={
										<div>
											<SC.Glow $color={theme['color-inverse-state-warning-fg']} />
											<SC.StatImage src={SuccessIcon} alt={'stat'} />
										</div>
									}
								/>
							</Col>
							<Col span={12} xs={6} md={12} xl={6}>
								<SBox
									title={t('My tickets')}
									value={statistics.trades || 0}
									extraContent={
										<div>
											<SC.Glow $color={theme['color-base-action-primary-default']} />
											<Button btnStyle={'primary'} onClick={() => router.push(`/${PAGES.MY_WALLET}`)} content={t('Show all')} />
										</div>
									}
								/>
							</Col>
						</SC.StatsOverlayWrapper>
					)
				)
			) : null}
		</SC.StatsWrapper>
	)
}

export default Stats
