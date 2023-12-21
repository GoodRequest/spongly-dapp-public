import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Col, Row } from 'antd'

// components
import UserStatisticRow from '@/components/statisticRow/UserStatisticRow'
import Button from '@/atoms/button/Button'
import UserTicketsList from '@/components/userTicketsList/UserTicketsList'
import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'

// utils
import { GET_USERS_STATISTICS, GET_USERS_TRANSACTIONS } from '@/utils/queries'
import networkConnector from '@/utils/networkConnector'
import {
	assignOtherAttrsToUserTicket,
	fetchSuccessRate,
	getProfit,
	getUserTicketType,
	parseParlayToUserTicket,
	parsePositionBalanceToUserTicket
} from '@/utils/helpers'
import { MSG_TYPE, NOTIFICATION_TYPE, USER_TICKET_TYPE, NETWORK_IDS, ENDPOINTS } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

// types
import { UserStatistic, UserTicket } from '@/typescript/types'
import { ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'

// styles
import * as SCS from '@/styles/GlobalStyles'

const MyWalletContent = () => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const router = useRouter()
	const isMyWallet = !router.query.id
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)
	const { signer } = networkConnector
	const isMounted = useIsMounted()
	const [fetchUserMarketTransactions] = useLazyQuery(GET_USERS_TRANSACTIONS)

	const [userStatistic, setUserStatistic] = useState<undefined | UserStatistic>(undefined)

	const [isLoading, setIsLoading] = useState(true)

	const id = isMyWallet ? address?.toLocaleLowerCase() : String(router.query.id).toLowerCase()

	const fetchStatistics = () => {
		setIsLoading(true)
		setTimeout(() => {
			Promise.all([
				fetchUserStatistic({ variables: { id }, context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM } }),
				fetchUserMarketTransactions({ variables: { account: id }, context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM } }),
				fetchSuccessRate(chain?.id)
			])
				.then(async (values) => {
					const marketData: { timestamp: string; id: string }[] = values?.[1]?.data?.marketTransactions?.map((item: any) => {
						return {
							timestamp: item?.timestamp,
							id: item?.positionBalance?.id
						}
					})
					const parlayData = values?.[0]?.data?.parlayMarkets
					const positionBalancesData = values?.[0]?.data?.positionBalances

					const parlayTickets: UserTicket[] = parlayData?.map((parlay: ParlayMarket) => {
						return parseParlayToUserTicket(parlay)
					})
					const positionTickets: UserTicket[] = positionBalancesData?.map((positionBalance: PositionBalance) => {
						return parsePositionBalanceToUserTicket(positionBalance)
					})

					const wonTickets = [...parlayTickets, ...positionTickets]?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.SUCCESS)
					const lostTickets = [...parlayTickets, ...positionTickets]?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.MISS)
					const cancelledTickets = [...parlayData, ...positionTickets]?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.CANCELED)

					const numberOfAttempts = wonTickets.length + lostTickets.length
					let successRate = 0.0
					if (wonTickets.length !== 0) {
						successRate = Number(((wonTickets.length / numberOfAttempts) * 100).toFixed(2))
					}

					const profit = getProfit(wonTickets, lostTickets, cancelledTickets)

					const userMonthlyStats = values?.[2]?.find((item: any) => item?.ac === id)

					assignOtherAttrsToUserTicket([...parlayTickets, ...positionTickets], marketData, chain?.id, signer).then((ticketsWithOtherAttrs) => {
						setUserStatistic({
							user: {
								overAll: { ...values?.[0]?.data?.user, pnl: Number(profit), successRate },
								monthly: { pnl: 0, trades: userMonthlyStats?.tt, successRate: userMonthlyStats?.sr }
							},
							tickets: ticketsWithOtherAttrs.sort((a, b) => (Number(a.timestamp) < Number(b.timestamp) ? 1 : -1))
						})
					})
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e)
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading user statistics') }], NOTIFICATION_TYPE.NOTIFICATION)
				})
				.finally(() => {
					setIsLoading(false)
				})
		}, 500)
	}

	useEffect(() => {
		if (chain?.id ? signer && address : router.query.id) {
			fetchStatistics()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chain?.id, signer, router.query.id])

	const refetch = () => {
		if (chain?.id ? signer && address : router.query.id) {
			fetchStatistics()
		}
	}

	return (
		<Row gutter={[0, 16]}>
			<Col span={24}>
				<RainbowConnectButton.Custom>
					{({ account, chain, openConnectModal, mounted }) => {
						const connected = mounted && account && chain

						if (!connected && isMyWallet) {
							return (
								<SCS.Empty
									image={EmptyStateImage}
									description={
										<div>
											<p>{t('You do not have connected wallet. Please connect your wallet.')}</p>
											<Button btnStyle={'primary'} onClick={() => openConnectModal()} content={t('Connect Wallet')} />
										</div>
									}
								/>
							)
						}
						return (
							<Row gutter={[0, 16]}>
								<Col span={24}>
									{isMounted && <UserStatisticRow isMyWallet={isMyWallet} isLoading={isLoading} user={userStatistic?.user} />}
								</Col>
								<Col span={24}>
									<UserTicketsList refetch={refetch} isMyWallet={isMyWallet} isLoading={isLoading} tickets={userStatistic?.tickets} />
								</Col>
							</Row>
						)
					}}
				</RainbowConnectButton.Custom>
			</Col>
		</Row>
	)
}

export default MyWalletContent
