import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next-translate-routes'
import { useSelector } from 'react-redux'
import { orderBy } from 'lodash'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import PresentationSlider from '@/components/presentationSlider/PresentationSlider'
import TicketList from '@/components/ticketList/TicketList'
import { decodeSorter, pickListTypeFromQuery } from '@/utils/helpers'
import { LIST_TYPE } from '@/utils/enums'
import { ORDER_DIRECTION, TICKET_SORTING, TICKET_TYPE } from '@/utils/constants'
import { RootState } from '@/redux/rootReducer'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import SBox from '@/components/sBox/SBox'
import BalanceIcon from '@/assets/icons/balanece-icon.svg'

const DashboardContent = () => {
	const router = useRouter()
	const { data, isLoading, isFailure } = useSelector((state: RootState) => state.tickets.ticketList)
	const [loading, setLoading] = useState(false)
	const [activeKeysList, setActiveKeysList] = useState<string[]>([])
	const { t } = useTranslation()
	const onlyOpenTickets = useMemo(
		() =>
			orderBy(
				data.filter((ticket) => ticket.ticket.ticketType === TICKET_TYPE.OPEN_TICKET),
				[`ticket.${TICKET_SORTING.SUCCESS_RATE}`],
				[ORDER_DIRECTION.DESCENDENT]
			),
		[data]
	)
	const [onlyOpenTicketsSorted, setOnlyOpenTicketsSorted] = useState<ITicketContent[] | undefined>(onlyOpenTickets)

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

	useEffect(() => {
		if (isLoading) {
			setLoading(true)
		} else {
			// NOTE: give some time to parse through data
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
	}, [isLoading])

	return (
		<>
			<Row gutter={[16, 40]}>
				<Col span={6}>
					<SBox title={t('Account balance')} value={'942.20 ETH'} icon={BalanceIcon} />
				</Col>
				<Col span={6}>
					<SBox title={t('Profits')} value={'+216 000 $'} />
				</Col>
				<Col span={6}>
					<SBox title={t('Success rate')} value={'82.42%'} />
				</Col>
				<Col span={6}>
					<SBox title={t('My tickets')} value={'12'} />
				</Col>
				<Col span={24}>
					<PresentationSlider />
				</Col>
			</Row>
			{pickListTypeFromQuery(router.query?.listType as string | undefined) === LIST_TYPE.TICKETS && (
				<TicketList
					type={TICKET_TYPE.HOT_TICKET}
					list={onlyOpenTicketsSorted || []}
					loading={loading}
					failure={isFailure}
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
