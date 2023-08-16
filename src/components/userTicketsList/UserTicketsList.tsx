import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next-translate-routes'

import { UserTicket } from '@/typescript/types'
import UserTicketTableRow from './UserTicketTableRow'
import { WALLET_TICKETS } from '@/utils/enums'

import * as SC from './UserTicketsListStyles'

import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import RadioButtons from '@/atoms/radioButtons/RadioButtons'
import Select from '@/atoms/select/Select'
import YouNeedToClaimBanner from './YouNeedToClaimBanner'

type Props = {
	tickets: UserTicket[] | undefined
	isLoading: boolean
	refetch: () => void
}

const UserTicketsList = ({ tickets, isLoading, refetch }: Props) => {
	const { t } = useTranslation()
	const router = useRouter()
	const { query, isReady } = useRouter()

	const [pagination, setPagination] = useState<{ page: number }>({ page: 1 })
	const [shownTickets, setShownTickets] = useState<UserTicket[] | undefined>([])
	const [sortedTickets, setSortedTickets] = useState<UserTicket[] | undefined>([])

	const [filter, setFilter] = useState<{ status: WALLET_TICKETS }>({ status: WALLET_TICKETS.ALL })

	const claimableSuccessfulTicketCount = tickets?.filter((item) => item.isClaimable && item.ticketType === WALLET_TICKETS.SUCCESSFUL).length || 0
	const claimableCanceledTicketCount = tickets?.filter((item) => item.isClaimable && item.ticketType === WALLET_TICKETS.PAUSED_CANCELED).length || 0

	const WALLET_TICKET_OPTIONS: Array<{ label: string; value: string }> = [
		{
			label: t('All'),
			value: WALLET_TICKETS.ALL
		},
		{
			label: t('Successful'),
			value: WALLET_TICKETS.SUCCESSFUL
		},
		{
			label: t('Missed'),
			value: WALLET_TICKETS.MISSED
		},
		{
			label: t('Ongoing'),
			value: WALLET_TICKETS.ONGOING
		},
		{
			label: t('Open tickets'),
			value: WALLET_TICKETS.OPEN_TICKETS
		},
		{
			label: t('Paused / Canceled'),
			value: WALLET_TICKETS.PAUSED_CANCELED
		}
	]

	const handleStatusChange = (value: WALLET_TICKETS) => {
		setFilter({ status: value })
	}

	useEffect(() => {
		setFilter({ status: (router.query.status as WALLET_TICKETS) || WALLET_TICKETS.ALL })
	}, [router.query.status])

	useEffect(() => {
		if (!isLoading) {
			setPagination({ page: 1 })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tickets])

	useEffect(() => {
		if (isReady) {
			setPagination({
				page: Number(query?.page) ? Number(query?.page) : 1
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady])

	useEffect(() => {
		setShownTickets(sortedTickets?.slice(0, pagination.page * 10))
		router.push(
			{
				pathname: '/my-wallet',
				query: {
					page: pagination?.page,
					status: filter.status
				}
			},
			undefined,
			{ scroll: false }
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination, sortedTickets])

	useEffect(() => {
		if (tickets) {
			switch (filter.status) {
				case WALLET_TICKETS.MISSED:
					setSortedTickets(tickets.filter((ticket) => ticket.ticketType === WALLET_TICKETS.MISSED))
					break
				case WALLET_TICKETS.ONGOING:
					setSortedTickets(tickets.filter((ticket) => ticket.ticketType === WALLET_TICKETS.ONGOING))
					break
				case WALLET_TICKETS.OPEN_TICKETS:
					setSortedTickets(tickets.filter((ticket) => ticket.ticketType === WALLET_TICKETS.OPEN_TICKETS))
					break
				case WALLET_TICKETS.PAUSED_CANCELED:
					setSortedTickets(tickets.filter((ticket) => ticket.ticketType === WALLET_TICKETS.PAUSED_CANCELED))
					break
				case WALLET_TICKETS.SUCCESSFUL:
					setSortedTickets(tickets.filter((ticket) => ticket.ticketType === WALLET_TICKETS.SUCCESSFUL))
					break
				default:
					setSortedTickets(tickets)
			}
		}
	}, [filter.status, tickets])

	const showMore = () => {
		setPagination({
			page: pagination.page + 1
		})
	}

	const userTickets = () => {
		if (isLoading) {
			return (
				<>
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
				</>
			)
		}
		if (!shownTickets || shownTickets?.length === 0) {
			return (
				<SC.Empty
					image={EmptyStateImage}
					description={
						<div>
							<p>{t('You do not have any tickets')}</p>
						</div>
					}
				/>
			)
		}
		return shownTickets?.map((data) => <UserTicketTableRow refetch={refetch} ticket={data} key={data?.id} />)
	}

	const hasMoreData = () => {
		if (!tickets) return false

		if (pagination.page * 10 >= (sortedTickets?.length || 0)) {
			return false
		}

		return true
	}

	return (
		<SC.ContentWrapper>
			{claimableSuccessfulTicketCount + claimableCanceledTicketCount > 0 && <YouNeedToClaimBanner />}
			<Row>
				<Col span={24}>
					<SC.MobileWrapper>
						<Select options={WALLET_TICKET_OPTIONS} onChange={handleStatusChange} value={filter.status} />
					</SC.MobileWrapper>
					<SC.PCWrapper>
						<RadioButtons
							defaultValue={WALLET_TICKETS.ALL}
							options={WALLET_TICKET_OPTIONS}
							onChange={(event) => {
								handleStatusChange(event.target.value)
							}}
							value={filter.status}
							minimizeFirstOption={true}
							counts={[
								{ value: WALLET_TICKETS.PAUSED_CANCELED, count: claimableCanceledTicketCount },
								{ value: WALLET_TICKETS.SUCCESSFUL, count: claimableSuccessfulTicketCount }
							]}
						/>
					</SC.PCWrapper>
				</Col>
				<Col span={24}>{userTickets()}</Col>
			</Row>
			{hasMoreData() && (
				<Row>
					<Col span={24}>
						<SC.ShowMoreButton type={'primary'} onClick={showMore}>
							<SC.ButtonContent>
								<span>{t('Show more')}</span>
								<SC.ButtonIcon src={ArrowDownIcon} />
							</SC.ButtonContent>
						</SC.ShowMoreButton>
					</Col>
				</Row>
			)}
		</SC.ContentWrapper>
	)
}

export default UserTicketsList
