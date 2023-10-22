import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { useTranslation } from 'next-export-i18n'
import { includes } from 'lodash'
import { useRouter } from 'next-translate-routes'
import { Col } from 'antd'

import { formatTicketPositionsForStatistics, getUserTicketType } from '@/utils/helpers'
import { USER_TICKET_TYPE } from '@/utils/constants'
import { PAGES } from '@/utils/enums'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { useIsMounted } from '@/hooks/useIsMounted'
import * as SC from './StatsStyles'
import SBox from '@/components/sBox/SBox'
import SuccessIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsIcon from '@/assets/icons/stat-profits-icon.svg'
import BalanceIcon from '@/assets/icons/stat-balance-icon.svg'
import { roundPrice } from '@/utils/formatters/currency'
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
		<SC.StatsWrapper>
			{includes(userStatistics, router.pathname) ? (
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
									extraContent={<img src={BalanceIcon} alt={'stat'} />}
								/>
							</Col>
							<Col span={12} xs={6} md={12} xl={6}>
								<SBox title={t('Profits')} value={`${roundPrice(statistics?.pnl)} $`} extraContent={<img src={ProfitsIcon} alt={'stat'} />} />
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
									extraContent={<Button btnStyle={'primary'} onClick={() => router.push(`/${PAGES.MY_WALLET}`)} content={t('Show all')} />}
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