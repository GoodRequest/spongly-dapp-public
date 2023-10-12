import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
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
import SuccessIcon from '@/assets/icons/success-rate-statistics-icon.png'
import ProfitsTicketsIcon from '@/assets/icons/profits-tickets-statistics-icon.png'
import Button from '@/atoms/button/Button'

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
	const eleRef = useRef<HTMLDivElement | null>(null)

	const { data } = useBalance({
		address
	})

	const fetchStats = async () => {
		console.log('called stats')
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
		fetchStats()
	}, [])

	// Scrolling left / right with statistics
	// eslint-disable-next-line consistent-return
	useEffect(() => {
		const ele = eleRef.current
		if (ele) {
			let pos = { top: 0, left: 0, x: 0, y: 0 }

			const mouseDownHandler = (e: MouseEvent) => {
				ele.style.userSelect = 'none'

				pos = {
					left: ele.scrollLeft,
					top: ele.scrollTop,
					x: e.clientX,
					y: e.clientY
				}
				const mouseMoveHandler = (e: MouseEvent) => {
					const dx = e.clientX - pos.x
					const dy = e.clientY - pos.y

					ele.scrollTop = pos.top - dy
					ele.scrollLeft = pos.left - dx
				}

				const mouseUpHandler = () => {
					document.removeEventListener('mousemove', mouseMoveHandler)
					document.removeEventListener('mouseup', mouseUpHandler)
				}

				document.addEventListener('mousemove', mouseMoveHandler)
				document.addEventListener('mouseup', mouseUpHandler)
			}

			ele.addEventListener('mousedown', mouseDownHandler)

			return () => {
				ele.removeEventListener('mousedown', mouseDownHandler)
			}
		}
	}, [])

	return (
		<SC.MainContainer>
			<Row id={'scroll-container'} ref={eleRef} style={{ width: '100%', overflow: 'scroll', marginBottom: 40 }}>
				{includes(userStatistics, router.pathname) ? (
					isLoading && !statistics ? (
						<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					) : (
						!isLoading &&
						statistics && (
							<SC.StatsOverlayWrapper>
								<Col span={6} style={{ paddingRight: 16 }}>
									<SBox
										title={t('Account balance')}
										value={`${Number(data?.formatted).toFixed(4)} ${data?.symbol}`}
										extraContent={<img src={ProfitsTicketsIcon} alt={'stat'} />}
									/>
								</Col>
								<Col span={6} style={{ paddingRight: 16 }}>
									<SBox
										title={t('Profits')}
										value={`${roundPrice(statistics?.pnl)} $`}
										extraContent={<img src={ProfitsTicketsIcon} alt={'stat'} />}
									/>
								</Col>
								<Col span={6} style={{ paddingRight: 16 }}>
									<SBox
										title={t('Success rate')}
										value={`${statistics.successRate} %`}
										extraContent={<img src={SuccessIcon} alt={'stat'} />}
									/>
								</Col>
								<Col span={6}>
									<SBox
										title={t('My tickets')}
										value={statistics.trades}
										extraContent={
											<Button btnStyle={'primary'} onClick={() => router.push(`/${PAGES.MY_WALLET}`)} content={t('Show all')} />
										}
									/>
								</Col>
							</SC.StatsOverlayWrapper>
						)
					)
				) : null}
			</Row>

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
