import React, { Dispatch, SetStateAction } from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { RootState } from '@/redux/rootReducer'
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'

// utils
import { BET_OPTIONS, FORM } from '@/utils/enums'
import { checkTotalWinnerBetExist, getOddByBetType, updateUnsubmittedTicketMatches } from '@/utils/helpers'
import { MIN_ODD_TRESHOLD } from '@/utils/constants'

// styled
import * as SC from '@/components/oddButton/OddButtonStyles'

type Props = {
	betOption: BET_OPTIONS
	match: TicketPosition
	oddName?: string
	setVisibleTotalWinnerModal?: Dispatch<SetStateAction<boolean>>
	isMobilePanel?: boolean
	isHeader?: boolean
}

const OddButton = (props: Props) => {
	const dispatch = useDispatch()
	const { betOption, match, oddName, setVisibleTotalWinnerModal, isMobilePanel, isHeader } = props
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const isMatchInActiveTicket = activeTicketValues?.matches?.find((m) => m.gameId === match.gameId)

	// if (match.id === '0x975c36db306192af347508e4acfab6abe5ab1885') {
	// 	console.log(oddName)
	// }

	// TODO: refactore TicketPosition type and use Imatch type and remove as any
	return getOddByBetType(match as any, !!activeTicketValues.copied, betOption).formattedOdd > MIN_ODD_TRESHOLD ? (
		<SC.MatchContentOddButton
			isHeader={isHeader}
			isMobilePanel={isMobilePanel}
			value={betOption}
			active={isMatchInActiveTicket?.betOption === betOption}
			onClick={() => {
				if (setVisibleTotalWinnerModal && checkTotalWinnerBetExist(activeTicketValues, match)) {
					setVisibleTotalWinnerModal(true)
				} else {
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
				}
			}}
		>
			{oddName || betOption}
		</SC.MatchContentOddButton>
	) : null
}

export default OddButton
