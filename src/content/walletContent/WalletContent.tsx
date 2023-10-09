import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'next-export-i18n'
import { max } from 'lodash'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { useRouter } from 'next-translate-routes'

// components
import { Col, Row } from 'antd'
import TicketsStatisticRow from '@/components/ticketsStatisticRow/TicketsStatisticRow'
import UserTicketsList from '@/components/userTicketsList/UserTicketsList'

// utils
import { GET_USERS_STATISTICS, GET_USERS_TRANSACTIONS } from '@/utils/queries'
import networkConnector from '@/utils/networkConnector'
import { getUserTicketType, removeDuplicateSubstring, ticketTypeToWalletType } from '@/utils/helpers'
import { MSG_TYPE, NETWORK_IDS, NOTIFICATION_TYPE, USER_TICKET_TYPE } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'
import { PAGES, WALLET_TICKETS } from '@/utils/enums'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

// types
import { UserStatistic, UserTicket } from '@/typescript/types'
import { ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'
import BackButton from '@/atoms/backButton/BackButton'

const MyWalletContent = () => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const router = useRouter()
	const isMyWallet = !router.query.id
	const provider = useProvider({ chainId: chain?.id || NETWORK_IDS.OPTIMISM })
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
		})

		return Promise.all(promises)
	}
	const fetchStatistics = () => {
		setIsLoading(true)
		const id = isMyWallet ? address?.toLocaleLowerCase() : String(router.query.id).toLowerCase()
		setTimeout(() => {
			Promise.all([
				fetchUserStatistic({ variables: { id }, context: { chainId: chain?.id } }),
				fetchUserMarketTransactions({ variables: { account: address?.toLocaleLowerCase() || '' }, context: { chainId: chain?.id } })
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

					const parlayTickets: UserTicket[] = parlayData?.map((parlay: ParlayMarket) => {
						const newParlay = {
							id: parlay?.id,
							won: parlay?.won,
							claimed: parlay?.claimed,
							sUSDPaid: parlay?.sUSDPaid,
							txHash: parlay?.txHash,
							quote: parlay?.totalQuote,
							amount: parlay?.totalAmount,
							marketQuotes: parlay?.marketQuotes,
							maturityDate: 0,
							ticketType: WALLET_TICKETS.ALL,
							timestamp: parlay.timestamp,
							sportMarketsFromContract: parlay.sportMarketsFromContract,
							isClaimable: false,
							positions: parlay?.positions?.map((positionItem) => {
								return {
									// some are moved up so its easier to work with them
									id: positionItem.id,
									side: positionItem.side,
									claimable: positionItem?.claimable,
									isCanceled: positionItem?.market?.isCanceled,
									isOpen: positionItem?.market?.isOpen,
									isPaused: positionItem?.market?.isPaused,
									isResolved: positionItem?.market?.isResolved,
									maturityDate: Number(positionItem?.market?.maturityDate),
									marketAddress: positionItem?.market?.address,
									market: {
										...positionItem.market,
										homeTeam: removeDuplicateSubstring(positionItem?.market?.homeTeam),
										awayTeam: removeDuplicateSubstring(positionItem?.market?.awayTeam)
									}
								}
							}),
							sportMarkets: parlay?.sportMarkets?.map((item) => ({
								gameId: item.gameId,
								address: item.address,
								isCanceled: item.isCanceled
							}))
						}

						const lastMaturityDate: number = max(newParlay?.positions?.map((item) => Number(item?.maturityDate))) || 0
						newParlay.maturityDate = lastMaturityDate

						return newParlay
					})

					const positionTickets: UserTicket[] = positions?.map((positionItem: PositionBalance) => {
						return {
							id: positionItem?.id,
							won: undefined,
							claimed: positionItem.claimed,
							sUSDPaid: positionItem?.sUSDPaid,
							txHash: positionItem?.firstTxHash,
							amount: positionItem?.amount,
							ticketType: WALLET_TICKETS.ALL,
							maturityDate: Number(positionItem?.position?.market?.maturityDate),
							isClaimable: false,
							timestamp: 0,
							positions: [
								{
									// some are moved up so its easier to work with them
									id: positionItem.id,
									side: positionItem.position.side,
									claimable: positionItem?.position?.claimable,
									isCanceled: positionItem?.position?.market?.isCanceled,
									isOpen: positionItem?.position?.market?.isOpen,
									isPaused: positionItem?.position?.market?.isPaused,
									isResolved: positionItem?.position?.market?.isResolved,
									marketAddress: positionItem?.position?.market?.address,
									maturityDate: Number(positionItem?.position?.market?.maturityDate),
									market: {
										...positionItem.position?.market,
										homeTeam: removeDuplicateSubstring(positionItem?.position?.market?.homeTeam),
										awayTeam: removeDuplicateSubstring(positionItem?.position?.market?.awayTeam)
									}
								}
							]
						}
					})

					const wonTickets = [...parlayTickets, ...positionTickets]?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.SUCCESS)
					const lostTickets = [...parlayTickets, ...positionTickets]?.filter((item) => getUserTicketType(item) === USER_TICKET_TYPE.MISS)

					const numberOfAttempts = wonTickets.length + lostTickets.length
					let successRate = 0.0
					if (wonTickets.length !== 0) {
						successRate = Number(((wonTickets.length / numberOfAttempts) * 100).toFixed(2))
					}

					assignOtherAttrs([...parlayTickets, ...positionTickets], marketData).then((ticketsWithOtherAttrs) => {
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
		// TODO: preco tu bol signer
		console.log('add', [address, chain?.id, signer])
		if (address && chain?.id && signer) {
			fetchStatistics()
		} else {
			console.log('else')
			router.push(`/${PAGES.DASHBOARD}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chain?.id, signer])

	const refetch = () => {
		if (address && chain?.id && signer) {
			fetchStatistics()
		}
	}

	return (
		<Row gutter={[0, 16]}>
			<Col span={24}>
				<BackButton backUrl={`/${PAGES.LEADERBOARD}`} />
			</Col>
			<Col span={24}>{isMounted && <TicketsStatisticRow isMyWallet={isMyWallet} isLoading={isLoading} user={userStatistic?.user} />}</Col>
			<Col span={24}>
				<UserTicketsList refetch={refetch} isMyWallet={isMyWallet} isLoading={isLoading} tickets={userStatistic?.tickets} />
			</Col>
		</Row>
	)
}

export default MyWalletContent
