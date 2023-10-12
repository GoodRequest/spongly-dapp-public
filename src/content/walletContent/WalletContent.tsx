import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'next-export-i18n'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { useRouter } from 'next-translate-routes'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Col, Row } from 'antd'

// components
import TicketsStatisticRow from '@/components/ticketsStatisticRow/TicketsStatisticRow'
import Button from '@/atoms/button/Button'
import UserTicketsList from '@/components/userTicketsList/UserTicketsList'
import BackButton from '@/atoms/backButton/BackButton'
import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'

// utils
import { GET_USERS_STATISTICS, GET_USERS_TRANSACTIONS } from '@/utils/queries'
import networkConnector from '@/utils/networkConnector'
import { formatTicketPositionsForStatistics, getUserTicketType, ticketTypeToWalletType } from '@/utils/helpers'
import { MSG_TYPE, NOTIFICATION_TYPE, USER_TICKET_TYPE } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'
import { PAGES } from '@/utils/enums'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

// types
import { UserStatistic, UserTicket } from '@/typescript/types'

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

	const assignOtherAttrs = async (ticket: UserTicket[], marketTransactions: { timestamp: string; id: string }[]) => {
		const promises = ticket.map(async (item) => {
			const userTicketType = getUserTicketType(item as any)

			let timestamp = item?.timestamp
			if (!timestamp) {
				timestamp = marketTransactions?.find((transaction) => transaction?.id === item?.id)?.timestamp || ''
			}
			if (!(userTicketType === USER_TICKET_TYPE.SUCCESS || userTicketType === USER_TICKET_TYPE.CANCELED) || item.claimed) {
				return {
					...item,
					isClaimable: false,
					ticketType: ticketTypeToWalletType(userTicketType),
					timestamp
				}
			}

			const maturityDates = item.positions?.map((position) => {
				return { maturityDate: position?.maturityDate, id: position.marketAddress }
			})

			const lastMaturityDate = maturityDates.sort((a, b) => (a.maturityDate < b.maturityDate ? 1 : -1))[0]
			if (chain?.id) {
				const contract = new ethers.Contract(lastMaturityDate.id, sportsMarketContract.abi, signer)

				const contractData = await contract.times()
				const expiryDate = contractData?.expiry?.toString()
				const now = dayjs()
				return {
					...item,
					isClaimable: !now.isAfter(expiryDate * 1000),
					ticketType: ticketTypeToWalletType(userTicketType),
					timestamp
				}
			}
			return {
				...item,
				isClaimable: false,
				ticketType: ticketTypeToWalletType(userTicketType),
				timestamp
			}
		})

		return Promise.all(promises)
	}
	const fetchStatistics = () => {
		setIsLoading(true)
		const id = isMyWallet ? address?.toLocaleLowerCase() : String(router.query.id).toLowerCase()
		setTimeout(() => {
			Promise.all([
				fetchUserStatistic({ variables: { id }, context: { chainId: chain?.id } }),
				fetchUserMarketTransactions({ variables: { account: id }, context: { chainId: chain?.id } })
			])
				.then(async (values) => {
					const marketData: { timestamp: string; id: string }[] = values?.[1]?.data?.marketTransactions?.map((item: any) => {
						return {
							timestamp: item?.timestamp,
							id: item?.positionBalance?.id
						}
					})
					const parlayData = values?.[0]?.data?.parlayMarkets
					const positions = values?.[0]?.data?.positionBalances
					const formattedTicketData = formatTicketPositionsForStatistics({ parlayMarkets: parlayData, positionBalances: positions })

					const allTickets = [...formattedTicketData.parlayTickets, ...formattedTicketData.positionTickets]

					const wonTickets = allTickets?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.SUCCESS)
					const lostTickets = allTickets?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.MISS)

					const numberOfAttempts = wonTickets.length + lostTickets.length
					let successRate = 0.0
					if (wonTickets.length !== 0) {
						successRate = Number(((wonTickets.length / numberOfAttempts) * 100).toFixed(2))
					}
					assignOtherAttrs(allTickets, marketData).then((ticketsWithOtherAttrs) => {
						setUserStatistic({
							user: { ...values?.[0]?.data?.user, successRate },
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
				<BackButton backUrl={`/${PAGES.LEADERBOARD}`} />
			</Col>

			<Col span={24}>
				<RainbowConnectButton.Custom>
					{({ account, chain, openConnectModal, mounted }) => {
						const connected = mounted && account && chain

						if (!connected && isMyWallet && !isLoading) {
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
									{isMounted && <TicketsStatisticRow isMyWallet={isMyWallet} isLoading={isLoading} user={userStatistic?.user} />}
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
