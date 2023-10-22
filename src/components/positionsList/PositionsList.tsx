import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change, getFormValues } from 'redux-form'
import { isEmpty } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { Row } from 'antd'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'

// components
import PositionListItem from './PositionListItem'
import Modal from '@/components/modal/Modal'
import MatchRow from '@/components/ticketBetContainer/components/matchRow/MatchRow'

// types
import { PositionWithCombinedAttrs, SGPItem } from '@/typescript/types'

// utils
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { FORM } from '@/utils/enums'

// hooks
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'

// styles
import * as SC from './PositionsListStyles'
import * as PSC from '@/components/ticketList/TicketListStyles'
import { copyTicketToUnsubmittedTickets } from '@/utils/helpers'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
	sgpFees?: SGPItem[]
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes, sgpFees }: Props) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket

	const [copyModal, setCopyModal] = useState<{ visible: boolean; onlyCopy: boolean }>({ visible: false, onlyCopy: false })
	const [modalPositions, setModalPositions] = useState<any>(undefined)

	const matchesWithChildMarkets = useMatchesWithChildMarkets(modalPositions, sgpFees, false)

	const isParlay = positionsWithCombinedAttrs?.length > 1

	const getOdds = (item: PositionWithCombinedAttrs, index: number) => {
		if (item?.isCombined) {
			return formatParlayQuote(item?.odds)
		}

		if (isParlay) {
			return formatParlayQuote(Number(marketQuotes?.[index]))
		}

		return formatPositionOdds(item)
	}
	// NOTE: showing historic odds -> there is no bonus.
	// const getBonus = (item: PositionWithCombinedAttrs) => {
	// 	return '1%'
	// }

	const copyTicket = (positions: any) => {
		setModalPositions(positions)
		setCopyModal({ visible: true, onlyCopy: isEmpty(betTicket?.matches) })
	}

	const handleCopyTicket = async () => {
		copyTicketToUnsubmittedTickets(matchesWithChildMarkets as any, unsubmittedTickets, dispatch, activeTicketValues.id)
		dispatch(change(FORM.BET_TICKET, 'matches', matchesWithChildMarkets))
		dispatch(change(FORM.BET_TICKET, 'copied', true))
	}

	const modals = (
		<Modal
			open={copyModal.visible}
			onCancel={() => {
				setCopyModal({ visible: false, onlyCopy: false })
			}}
			centered
		>
			{copyModal.onlyCopy ? <span>{t('Do you wish to add these matches?')}</span> : <span>{t('Your ticket already includes matches')}</span>}
			<Row>
				<PSC.MatchContainerRow span={24}>
					{matchesWithChildMarkets?.map((match: any, key: any) => (
						<MatchRow readOnly copied key={`matchRow-${key}`} match={match} />
					))}
				</PSC.MatchContainerRow>
				<button type={'button'} onClick={() => handleCopyTicket()}>
					AddToForm
				</button>
			</Row>
		</Modal>
	)

	return (
		<>
			{modals}
			<SC.PositionsListWrapper>
				{positionsWithCombinedAttrs?.map((item, index) => {
					return <PositionListItem copyTicket={copyTicket} position={item} quote={getOdds(item, index)} />
				})}
			</SC.PositionsListWrapper>
		</>
	)
}

export default PositionsList
