import React from 'react'
import { useTranslation } from 'next-export-i18n'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { change, getFormValues } from 'redux-form'

// utils
import { ACTIVE_BET_TICKET, IUnsubmittedBetTicket, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'
import { FORM } from '@/utils/enums'
import { copyTicketToUnsubmittedTickets } from '@/utils/helpers'

// components
import Modal from '@/components/modal/Modal'
import MatchRow from '../ticketBetContainer/components/matchRow/MatchRow'
import Button from '@/atoms/button/Button'

// styles
import * as SC from './CopyModalStyles'
import { MAX_TICKETS } from '@/utils/constants'

type Props = {
	onlyCopy: boolean
	isOpen: boolean
	handleClose: () => void
	matchesWithChildMarkets: any
}

const CopyModal = ({ onlyCopy, isOpen, handleClose, matchesWithChildMarkets }: Props) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket

	const handleCopyTicket = () => {
		copyTicketToUnsubmittedTickets(matchesWithChildMarkets as any, unsubmittedTickets, dispatch, activeTicketValues.id)
		dispatch(change(FORM.BET_TICKET, 'matches', matchesWithChildMarkets))
		dispatch(change(FORM.BET_TICKET, 'copied', true))
		handleClose()
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

	return (
		<Modal
			open={isOpen}
			onCancel={() => {
				handleClose()
			}}
			centered
		>
			{onlyCopy ? (
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
				{onlyCopy ? (
					<Col span={24}>
						<Button
							btnStyle={'secondary'}
							content={t('Add these to ticket')}
							onClick={() => {
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
									handleAddTicket()
								}}
							/>
						</Col>
					</>
				)}
			</Row>
		</Modal>
	)
}

export default CopyModal
