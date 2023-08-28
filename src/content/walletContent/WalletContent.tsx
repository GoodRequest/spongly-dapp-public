import { useEffect, useState } from 'react'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'next-export-i18n'
import { max } from 'lodash'

import { ethers } from 'ethers'
import dayjs from 'dayjs'
import TicketsStatisticRow from '@/components/ticketsStatisticRow/TicketsStatisticRow'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { UserStatistic, UserTicket } from '@/typescript/types'
import { ParlayMarket, PositionBalance } from '@/__generated__/resolvers-types'
import UserTicketsList from '@/components/userTicketsList/UserTicketsList'
import networkConnector from '@/utils/networkConnector'
import { getUserTicketType, ticketTypeToWalletType } from '@/utils/helpers'
import { MSG_TYPE, NETWORK_IDS, NOTIFICATION_TYPE, USER_TICKET_TYPE } from '@/utils/constants'
import { useIsMounted } from '@/hooks/useIsMounted'
import { showNotifications } from '@/utils/tsxHelpers'
import { WALLET_TICKETS } from '@/utils/enums'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'

const MyWalletContent = () => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const provider = useProvider({ chainId: chain?.id || NETWORK_IDS.OPTIMISM })
	const { signer } = networkConnector
	const isMounted = useIsMounted()
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)

	const [userStatistic, setUserStatistic] = useState<undefined | UserStatistic>(undefined)
	const [isLoading, setIsLoading] = useState(true)

	const assignOtherAttrs = async (ticket: UserTicket[]) => {
		const promises = ticket.map(async (item) => {
			const userTicketType = getUserTicketType(item as any)

			let timestamp = item?.timestamp
			if (!timestamp) {
				const transaction = await provider.getTransaction(item.txHash)
				const block = await provider.getBlock(transaction.blockNumber as any)
				timestamp = String(block.timestamp)
			}

			if (!(userTicketType === USER_TICKET_TYPE.SUCCESS || userTicketType === USER_TICKET_TYPE.CANCELED) || item.claimed) {
				return { ...item, isClaimable: false, ticketType: ticketTypeToWalletType(userTicketType), timestamp }
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
		setTimeout(() => {
			// fetchUserStatistic({ variables: { id: address?.toLocaleLowerCase() || '' }, context: { chainId: chain?.id } })
			fetchUserStatistic({ variables: { id: '0xF21e489f84566Bd82DFF2783C80b5fC1A9dca608'.toLocaleLowerCase() }, context: { chainId: chain?.id } })
				.then(async (values) => {
					const parlayData = values?.data?.parlayMarkets
					const positions = values?.data?.positionBalances

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
									market: positionItem.market
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
									market: positionItem.position?.market
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

					assignOtherAttrs([...parlayTickets, ...positionTickets]).then((ticketsWithOtherAttrs) => {
						setUserStatistic({
							user: { ...values?.data?.user, successRate },
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
		if (address && chain?.id && signer) {
			fetchStatistics()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chain?.id, signer])

	const refetch = () => {
		if (address && chain?.id && signer) {
			fetchStatistics()
		}
	}

	return (
		<>
			{isMounted && <TicketsStatisticRow isLoading={isLoading} user={userStatistic?.user} />}
			<UserTicketsList refetch={refetch} isLoading={isLoading} tickets={userStatistic?.tickets} />
		</>
	)
}

export default MyWalletContent
