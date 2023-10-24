import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import { map, slice } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useDispatch, useSelector } from 'react-redux'
import { change, getFormValues } from 'redux-form'
import { Col, Row } from 'antd'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/rootReducer'

// components
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import TicketListItem from '@/components/ticketList/TicketListItem'
import Sorter from '@/components/Sorter'
import Select from '@/atoms/select/Select'

// assets
import ArrowIcon from '@/assets/icons/arrow-down.svg'
import Modal from '@/components/modal/Modal'
import Button from '@/atoms/button/Button'
import MatchRow from '@/components/ticketBetContainer/components/matchRow/MatchRow'

// types
import { ACTIVE_BET_TICKET, IUnsubmittedBetTicket, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'
import { SGPItem } from '@/typescript/types'

// utils
import { MAX_TICKETS, Network, ORDER_DIRECTION, TICKET_SORTING, TICKET_TYPE } from '@/utils/constants'
import { copyTicketToUnsubmittedTickets, getTicketsTypeName, setSort } from '@/utils/helpers'
import { FORM, PAGES } from '@/utils/enums'

// hooks
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'

// styles
import * as SC from './TicketListStyles'
import * as SCS from '@/styles/GlobalStyles'

interface ITicketList {
	type: TICKET_TYPE
	list: ITicketContent[]
	loading: boolean
	failure: boolean
	activeKeysList: any[]
	setActiveKeysList: Dispatch<SetStateAction<string[]>>
}

const LIST_SIZE = 10

const TicketList: FC<ITicketList> = ({ type = TICKET_TYPE.OPEN_TICKET, list = [], loading, failure, activeKeysList, setActiveKeysList }) => {
	const [renderList, setRenderList] = useState<ITicketContent[]>(slice(list, 0, LIST_SIZE))
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { chain } = useNetwork()
	const router = useRouter()

	const [hasMore, setHasMore] = useState(list.length > LIST_SIZE)
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const [tempMatches, setTempMatches] = useState<any>()
	const [copyModal, setCopyModal] = useState<{ visible: boolean; onlyCopy: boolean }>({ visible: false, onlyCopy: false })
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()

	const matchesWithChildMarkets = useMatchesWithChildMarkets(tempMatches, sgpFees, false)

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	useEffect(() => {
		setRenderList(slice(list, 0, renderList.length > LIST_SIZE ? renderList.length : LIST_SIZE))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [list])

	useEffect(() => {
		setHasMore(renderList.length < list.length)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderList])

	const addTicketsToList = () => {
		if (type === TICKET_TYPE.HOT_TICKET) {
			router.push(`/${PAGES.TICKETS}`)
		} else if (hasMore) {
			if (renderList.length < list.length && renderList.length + LIST_SIZE < list.length) {
				setRenderList([...renderList, ...slice(list, renderList.length, renderList.length + LIST_SIZE)])
			}
			if (renderList.length < list.length && renderList.length + LIST_SIZE >= list.length) {
				setRenderList([...list])
			}
		}
	}
	const sortOptions = [
		{
			label: t('The highest success rate'),
			value: `${TICKET_SORTING.SUCCESS_RATE}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest success rate'),
			value: `${TICKET_SORTING.SUCCESS_RATE}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The highest buy-in'),
			value: `${TICKET_SORTING.BUY_IN}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest buy-in'),
			value: `${TICKET_SORTING.BUY_IN}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The highest quote'),
			value: `${TICKET_SORTING.TOTAL_TICKET_QUOTE}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest quote'),
			value: `${TICKET_SORTING.TOTAL_TICKET_QUOTE}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The most matches'),
			value: `${TICKET_SORTING.MATCHES}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The least matches'),
			value: `${TICKET_SORTING.MATCHES}:${ORDER_DIRECTION.ASCENDENT}`
		}
	]

	const handleCopyTicket = async () => {
		copyTicketToUnsubmittedTickets(matchesWithChildMarkets as any, unsubmittedTickets, dispatch, activeTicketValues.id)
		dispatch(change(FORM.BET_TICKET, 'matches', matchesWithChildMarkets))
		dispatch(change(FORM.BET_TICKET, 'copied', true))
		// helper variable which says that ticket has matches which were copied
	}

	const handleAddTicket = async () => {
		const largestId = unsubmittedTickets?.reduce((maxId, ticket) => {
			return Math.max(maxId, ticket.id as number)
		}, 0)
		const matches = matchesWithChildMarkets || []

		const data = unsubmittedTickets
			? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			  [...unsubmittedTickets, { id: (largestId || 1) + 1, matches, copied: true }]
			: [{ id: 1, matches, copied: true }]

		await dispatch({
			type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
			payload: {
				data
			}
		})
		// NOTE: set active state for new ticket item in HorizontalScroller id === data.length (actual state of tickets and set active ticket to last item)
		await dispatch({ type: ACTIVE_BET_TICKET.ACTIVE_BET_TICKET_SET, payload: { data: { id: (largestId || 1) + 1 } } })
	}

	const handleSubmitSort = (value: string) => {
		if (!value) {
			// clear sort
			setSort(undefined)
		} else {
			const [property, direction] = value.split(':')
			setSort(property, direction as ORDER_DIRECTION)
		}
	}

	const modals = (
		<Modal
			open={copyModal.visible}
			onCancel={() => {
				setCopyModal({ visible: false, onlyCopy: false })
			}}
			centered
		>
			{copyModal.onlyCopy ? (
				<SC.ModalTitle>{t('Do you wish to add these matches?')}</SC.ModalTitle>
			) : (
				<>
					<SC.ModalTitle>{t('Your ticket already includes matches')}</SC.ModalTitle>
					<SC.ModalDescription style={{ marginBottom: '8px' }}>
						{t('Do you wish to replace these matches or create a new ticket?')}
					</SC.ModalDescription>
				</>
			)}
			<SC.ModalDescriptionWarning>{t('Odds might slightly differ')}</SC.ModalDescriptionWarning>
			<Row>
				<SC.MatchContainerRow span={24}>
					{matchesWithChildMarkets?.map((match: any, key: any) => (
						<MatchRow readOnly copied key={`matchRow-${key}`} match={match} />
					))}
				</SC.MatchContainerRow>
			</Row>
			<Row gutter={[16, 16]}>
				{copyModal.onlyCopy ? (
					<Col span={24}>
						<Button
							btnStyle={'secondary'}
							content={t('Add these to ticket')}
							onClick={() => {
								setCopyModal({ visible: false, onlyCopy: false })
								handleCopyTicket()
							}}
						/>
					</Col>
				) : (
					<>
						<Col span={24}>
							<Button
								btnStyle={'secondary'}
								content={`${t('Replace existing ticket')} (Ticket ${
									Number(unsubmittedTickets?.map((e) => e.id).indexOf(activeTicketValues.id)) + 1
								})`}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleCopyTicket()
								}}
							/>
						</Col>
						<Col span={24}>
							<Button
								btnStyle={'primary'}
								content={`${t('Create new ticket')} (Ticket ${Number(unsubmittedTickets?.length) + 1})`}
								disabled={unsubmittedTickets?.length === MAX_TICKETS}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleAddTicket()
								}}
							/>
						</Col>
					</>
				)}
			</Row>
		</Modal>
	)

	const ticketList = useMemo(
		() =>
			map(renderList, (item: ITicketContent, index: any) => (
				<TicketListItem
					type={type}
					ticket={item.ticket}
					key={index}
					index={index}
					activeKeysList={activeKeysList}
					sgpFees={sgpFees}
					setActiveKeysList={setActiveKeysList}
					setCopyModal={setCopyModal}
					setTempMatches={setTempMatches}
				/>
			)),
		[activeKeysList, renderList, setActiveKeysList, type, sgpFees]
	)

	return (
		<>
			<SC.TicketListWrapper>
				<SC.PCRow type={type} gutter={0}>
					<Col span={20}>
						<h1>{getTicketsTypeName(type, t)}</h1>
						{type === TICKET_TYPE.HOT_TICKET && <SC.HotTicketDescription>{t('Top 10 tickets you shouldn’t miss!')}</SC.HotTicketDescription>}
					</Col>
				</SC.PCRow>

				<Row>
					<Col span={24}>
						{loading || failure ? (
							<>
								<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
								<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
							</>
						) : (
							<>
								{type !== TICKET_TYPE.HOT_TICKET && (
									<SCS.SorterRow>
										<SCS.HorizontalSorters>
											<Col span={5}>
												<Sorter title={t('Wallet')} />
											</Col>
											<Col span={8}>
												<Sorter title={t('Success rate')} name={TICKET_SORTING.SUCCESS_RATE} />
											</Col>
											<Col span={3}>
												<Sorter title={t('Buy in')} name={TICKET_SORTING.BUY_IN} />
											</Col>
											<Col span={3}>
												<Sorter title={t('Quote')} name={TICKET_SORTING.TOTAL_TICKET_QUOTE} />
											</Col>
											<Col span={3}>
												<Sorter title={t('Matches')} name={TICKET_SORTING.MATCHES} />
											</Col>
										</SCS.HorizontalSorters>
										<SCS.SelectSorters>
											<Select allowClear options={sortOptions} placeholder={t('Sort by')} onChange={handleSubmitSort} />
										</SCS.SelectSorters>
									</SCS.SorterRow>
								)}
								{renderList.length > 0 ? (
									ticketList
								) : (
									<SC.TicketItemEmptyState>
										<Row>
											<Col span={5}>
												<SC.EmptyImage />
											</Col>
											<Col span={19}>
												<h4>
													{t('There are currently no {{ticketsType}}', { ticketsType: getTicketsTypeName(type, t)?.toLowerCase() })}
												</h4>
												<p>{t('You can try other type')}</p>
											</Col>
										</Row>
									</SC.TicketItemEmptyState>
								)}
								{hasMore && (
									<SCS.LoadMore onClick={addTicketsToList}>
										{type === TICKET_TYPE.HOT_TICKET ? t('Show all tickets') : t('Show more')}
										<SCS.Icon degree={type === TICKET_TYPE.HOT_TICKET ? 270 : 0} icon={ArrowIcon} />
									</SCS.LoadMore>
								)}
							</>
						)}
					</Col>
				</Row>
			</SC.TicketListWrapper>
			{modals}
		</>
	)
}

export default TicketList
