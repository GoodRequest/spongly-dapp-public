import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'
import { useLazyQuery } from '@apollo/client'
import { GET_PARLAY_DETAIL, GET_POSITION_BALANCE_DETAIL } from '@/utils/queries'
import { parseParlayToUserTicket, parsePositionBalanceToUserTicket } from '@/utils/helpers'

const TicketDetailContent = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const [fetchParlayDetail] = useLazyQuery(GET_PARLAY_DETAIL)
	const [fetchPositionDetail] = useLazyQuery(GET_POSITION_BALANCE_DETAIL)
	const [ticketData, setTicketData] = useState<any[]>([])

	const [isLoading, setIsLoading] = useState(false)

	const fetchData = async (isParlay: boolean) => {
		try {
			let result
			if (isParlay) {
				const { data } = await fetchParlayDetail({
					variables: { id: router.query.id }
				})
				result = parseParlayToUserTicket(data?.parlayMarket)
			} else {
				const { data } = await fetchPositionDetail({
					variables: { id: router.query.id }
				})
				result = parsePositionBalanceToUserTicket(data?.positionBalance)
			}

			console.log(result)
		} catch (e) {
			// TODO: throw notif
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (router.query.id) {
			setIsLoading(true)
			if (router.query.id.includes('-')) {
				fetchData(false)
			} else {
				fetchData(true)
			}
		}
		// else {
		// 	NOTE: redirect to 404?
		// }

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	return <span>Dzengala</span>
}

export default TicketDetailContent
