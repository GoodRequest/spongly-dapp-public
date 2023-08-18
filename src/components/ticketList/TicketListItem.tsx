import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { isEmpty, map } from 'lodash'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useDispatch, useSelector } from 'react-redux'
import { change, getFormValues } from 'redux-form'

// components
import TicketListItemHeader from '@/components/ticketList/TicketListItemHeader'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import Button from '@/atoms/button/Button'
import TicketItem from '@/components/ticketList/TicketItem'
import Modal from '@/components/modal/Modal'
import MatchRow from '@/components/ticketBetContainer/components/matchRow/MatchRow'

// types
import { RootState } from '@/redux/rootReducer'
import { ACTIVE_BET_TICKET, IUnsubmittedBetTicket, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'

// utils
import { FORM } from '@/utils/enums'
import { convertPositionNameToPosition, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'
import { TICKET_TYPE } from '@/utils/constants'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { orderPositionsAsSportMarkets, updateUnsubmittedTicketMatches } from '@/utils/helpers'

// styles
import * as SC from './TicketListStyles'

interface ITicketListItem extends ITicketContent {
	type: string
	loading?: boolean
	index: string | number
	activeKeysList: any[]
	setActiveKeysList: Dispatch<SetStateAction<string[]>>
}

const TicketListItem: FC<ITicketListItem> = ({ index, ticket, loading, type, activeKeysList, setActiveKeysList }) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [copyModal, setCopyModal] = useState<{ visible: boolean; onlyCopy: boolean }>({ visible: false, onlyCopy: false })
	const { sportsAMMContract } = networkConnector
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const [tempMatches, setTempMatches] = useState<any>()
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const [activeMatches, setActiveMatches] = useState<any[]>([])

	const orderedPositions = orderPositionsAsSportMarkets(ticket)

	const formatMatchesToTicket = async () => {
		return Promise.all(
			orderedPositions
				?.filter((item) => item.market.isOpen)
				.map(async (item) => {
					const data = await sportsAMMContract?.getMarketDefaultOdds(item.market.address, false)
					return {
						...item.market,
						gameId: item.id,
						homeOdds: bigNumberFormatter(data?.[0] || 0),
						awayOdds: bigNumberFormatter(data?.[1] || 0),
						drawOdds: bigNumberFormatter(data?.[2] || 0),
						betOption: getSymbolText(convertPositionNameToPosition(item.side), item.market)
					}
				})
		)
	}

	useEffect(() => {
		const filterOngoingMatches = async () => {
			const matches = await formatMatchesToTicket()

			const filterOngoingMatches = matches.filter((match) => !(match.awayOdds === 0 && match.homeOdds === 0 && match.awayOdds === 0))
			setActiveMatches(filterOngoingMatches)
		}

		filterOngoingMatches()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticket])

	const handleAddTicket = async () => {
		const largestId = unsubmittedTickets?.reduce((maxId, ticket) => {
			return Math.max(maxId, ticket.id as number)
		}, 0)
		const matches = activeMatches || []

		const data = unsubmittedTickets
			? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			  [...unsubmittedTickets, { id: (largestId || 1) + 1, matches, copied: true }]
			: [{ id: 1, matches, copied: true }]

		dispatch({
			type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
			payload: {
				data
			}
		})
		// NOTE: set active state for new ticket item in HorizontalScroller id === data.length (actual state of tickets and set active ticket to last item)
		dispatch({ type: ACTIVE_BET_TICKET.ACTIVE_BET_TICKET_SET, payload: { data: { id: (largestId || 1) + 1 } } })
	}

	const handleCopyTicket = async () => {
		updateUnsubmittedTicketMatches(activeMatches as any, unsubmittedTickets, dispatch, activeTicketValues.id, true)
		dispatch(change(FORM.BET_TICKET, 'matches', activeMatches))
		// helper variable which says that ticket has matches which were copied
		dispatch(change(FORM.BET_TICKET, 'copied', true))
		// Ticket id which will be sent to submit if ticket was copied
		dispatch(change(FORM.BET_TICKET, 'ticketId', ticket.id))
	}

	const handleCollapseChange = (e: any) => {
		setActiveKeysList([...e])
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
			<SC.ModalDescription>{t('Odds might slighly differ')}</SC.ModalDescription>
			<Row>
				<SC.MatchContainerRow span={24}>
					{tempMatches?.map((match: any, key: any) => (
						<MatchRow readOnly key={`matchRow-${key}`} match={match} />
					))}
				</SC.MatchContainerRow>
			</Row>
			<Row gutter={[16, 16]}>
				{copyModal.onlyCopy ? (
					<Col span={24}>
						<Button
							btnStyle={'secondary'}
							content={<span>{t('Add these to ticket')}</span>}
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
								content={<span>{t('Replace existing ticket')}</span>}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleCopyTicket()
								}}
							/>
						</Col>
						<Col span={24}>
							<Button
								btnStyle={'primary'}
								content={<span>{t('Create new ticket')}</span>}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleCopyTicket()
									handleAddTicket()
								}}
							/>
						</Col>
					</>
				)}
			</Row>
		</Modal>
	)

	return (
		<>
			{modals}
			<SC.TicketCollapse collapsible={'icon'} expandIconPosition={'end'} onChange={(e) => handleCollapseChange(e)} activeKey={activeKeysList}>
				<SC.ColapsePanel header={<TicketListItemHeader ticket={ticket} />} key={`${ticket.account}-${index}`}>
					{!loading && (
						<SC.PanelContent>
							<Row gutter={[16, 16]}>
								{map(orderedPositions, (item, index) => (
									<Col key={item.id} span={24} lg={12}>
										<TicketItem
											match={item}
											oddsInfo={{ quote: Number(ticket?.marketQuotes?.[index]), isParlay: orderedPositions.length > 1 }}
										/>
									</Col>
								))}
							</Row>
							<SC.StylesRow gutter={[16, 16]}>
								{/* <Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
									<Button
										btnStyle={'secondary'}
										content={<span>{t('Show ticket detail')}</span>}
										onClick={() => {
											// TODO: redirect to detail
										}}
									/>
								</Col> */}
								{(type === TICKET_TYPE.ONGOING_TICKET || type === TICKET_TYPE.OPEN_TICKET || type === TICKET_TYPE.HOT_TICKET) && (
									<Col md={12} span={24}>
										<Button
											disabledPopoverText={t('Matches are no longer open to copy')}
											disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
											btnStyle={'primary'}
											content={<span>{type === TICKET_TYPE.ONGOING_TICKET ? t('Copy open positions') : t('Copy ticket')}</span>}
											onClick={async () => {
												// NOTE: if ticket has matches open modal which ask if you want to replace ticket or create new one
												if (!isEmpty(betTicket?.matches)) {
													setTempMatches(activeMatches)
													setCopyModal({ visible: true, onlyCopy: false })
												} else {
													// Otherwise create ticket
													setTempMatches(activeMatches)
													setCopyModal({ visible: true, onlyCopy: true })
												}
											}}
										/>
									</Col>
								)}
								<Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
									{/* <Button btnStyle={'secondary'} content={<span>{t('Show ticket detail')}</span>} onClick={handleCreateTicket} /> */}
								</Col>
							</SC.StylesRow>
						</SC.PanelContent>
					)}
				</SC.ColapsePanel>
			</SC.TicketCollapse>
		</>
	)
}

export default TicketListItem
