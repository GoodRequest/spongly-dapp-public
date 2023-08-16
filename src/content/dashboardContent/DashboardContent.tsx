import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next-translate-routes'
import { useSelector } from 'react-redux'
import { orderBy } from 'lodash'
import PresentationSlider from '@/components/presentationSlider/PresentationSlider'
import TicketList from '@/components/ticketList/TicketList'
import { decodeSorter, pickListTypeFromQuery } from '@/utils/helpers'
import { LIST_TYPE } from '@/utils/enums'
import { ORDER_DIRECTION, TICKET_SORTING, TICKET_TYPE } from '@/utils/constants'
import { RootState } from '@/redux/rootReducer'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'

const DashboardContent = () => {
	const router = useRouter()
	const { data, isLoadingBatch } = useSelector((state: RootState) => state.tickets.ticketList)
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)
	const [activeKeysList, setActiveKeysList] = useState<string[]>([])

	const onlyOpenTickets = useMemo(
		() =>
			orderBy(
				data?.filter((ticket) => ticket.ticket.ticketType === TICKET_TYPE.OPEN_TICKET),
				[`ticket.${TICKET_SORTING.SUCCESS_RATE}`],
				[ORDER_DIRECTION.DESCENDENT]
			),
		[data]
	)
	const [onlyOpenTicketsSorted, setOnlyOpenTicketsSorted] = useState<ITicketContent[] | undefined>(onlyOpenTickets)

	useEffect(() => {
		if (onlyOpenTicketsSorted && onlyOpenTicketsSorted.length > 0) {
			setInitialized(true)
		}
	}, [onlyOpenTicketsSorted])

	useEffect(() => {
		setLoading(isLoadingBatch)
	}, [isLoadingBatch])

	useEffect(() => {
		const { direction, property } = decodeSorter()
		if (direction && property) {
			const ordered = orderBy(onlyOpenTickets, [`ticket.${property}`], [direction])
			setOnlyOpenTicketsSorted(ordered)
		} else {
			const ordered = orderBy(onlyOpenTickets, [`ticket.${property}`], [ORDER_DIRECTION.DESCENDENT])
			setOnlyOpenTicketsSorted(ordered)
		}
	}, [onlyOpenTickets, router.query.sorter])

	return (
		<>
			<PresentationSlider />
			{pickListTypeFromQuery(router.query?.listType as string | undefined) === LIST_TYPE.TICKETS && (
				<TicketList
					type={TICKET_TYPE.HOT_TICKET}
					list={onlyOpenTicketsSorted || []}
					loading={loading || !initialized}
					activeKeysList={activeKeysList}
					setActiveKeysList={setActiveKeysList}
				/>
			)}
			{/* TODO: {pickListTypeFromQuery(router.query?.listType as string | undefined) === LIST_TYPE.MATCHES && (
				<div />
			)}
			{pickListTypeFromQuery(router.query?.listType as string | undefined) === LIST_TYPE.MATCHES && (
				<div />
			)} */}
		</>
	)
}

export default DashboardContent
