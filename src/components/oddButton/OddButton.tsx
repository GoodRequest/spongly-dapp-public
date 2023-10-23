import React, { Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { useTranslation } from 'next-export-i18n'

// redux
import { RootState } from '@/redux/rootReducer'
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'

// utils
import { BET_OPTIONS, FORM } from '@/utils/enums'
import { checkTeamExistInBet, checkTotalWinnerBetExist, getOddByBetType, isWindowReady, updateUnsubmittedTicketMatches } from '@/utils/helpers'
import { MATCH_STATUS, MAX_TICKET_MATCHES, MIN_ODD_TRESHOLD, OddsType } from '@/utils/constants'
import { formatQuote } from '@/utils/formatters/quote'

// styled
import * as SC from '@/components/oddButton/OddButtonStyles'

type Props = {
	betOption: BET_OPTIONS
	match: TicketPosition
	oddName?: string
	setVisibleParlayValidationModal?: Dispatch<SetStateAction<{ visible: boolean; message: string }>>
	isMobilePanel?: boolean
	isHeader?: boolean
	disabled?: boolean
}

const OddButton = (props: Props) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { betOption, match, oddName, setVisibleParlayValidationModal, isMobilePanel, isHeader, disabled } = props
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const isSubmitting = useSelector((state: RootState) => state.betTickets.isSubmitting)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const isMatchInActiveTicket = activeTicketValues?.matches?.find((m) => m.gameId === match.gameId)
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL

	// TODO: refactore TicketPosition type and use Imatch type and remove as any
	return formatQuote(OddsType.DECIMAL, getOddByBetType(match as any, !!activeTicketValues.copied, actualOddType, betOption).rawOdd) > MIN_ODD_TRESHOLD ? (
		<SC.MatchContentOddButton
			isHeader={isHeader}
			isMobilePanel={isMobilePanel}
			value={betOption}
			disabled={
				disabled ||
				isSubmitting ||
				match.status === MATCH_STATUS.PAUSED ||
				match.status === MATCH_STATUS.CANCELED ||
				match.status === MATCH_STATUS.ONGOING ||
				match.status === MATCH_STATUS.SUCCESS
			}
			active={isMatchInActiveTicket?.betOption === betOption}
			onClick={() => {
				// Parlay validations - if matches exist and match is not already in ticket (then do update if user remove match)
				if (setVisibleParlayValidationModal && activeTicketValues.matches && !activeTicketValues.matches.find((m) => m.gameId === match.gameId)) {
					if (checkTotalWinnerBetExist(activeTicketValues, match)) {
						setVisibleParlayValidationModal({ visible: true, message: t('Only one participant per event is supported.') })
						return
					}
					if (activeTicketValues.matches && checkTeamExistInBet(activeTicketValues.matches, match)) {
						setVisibleParlayValidationModal({
							visible: true,
							message: t('{{ teamName }} is already in parlay. The same team from the same league can not be added to a parlay more than once.', {
								teamName: checkTeamExistInBet(activeTicketValues.matches, match)
							})
						})
						return
					}
					if (activeTicketValues.matches?.length === MAX_TICKET_MATCHES) {
						setVisibleParlayValidationModal({
							visible: true,
							message: t('You can only bet on {{ matches }} matches per ticket', { matches: MAX_TICKET_MATCHES })
						})
						return
					}
				}
				const matches = dispatch(
					updateActiveTicketMatches(
						{
							...match,
							betOption
						},
						activeTicketValues.matches
					)
				)
				updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
			}}
		>
			{oddName || betOption}
		</SC.MatchContentOddButton>
	) : null
}

export default OddButton
