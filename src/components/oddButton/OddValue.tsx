import React from 'react'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'

import * as SC from '@/components/oddButton/OddButtonStyles'
import { MIN_ODD_TRESHOLD } from '@/utils/constants'
import { getOddByBetType } from '@/utils/helpers'
import { BET_OPTIONS, FORM } from '@/utils/enums'
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'

type Props = {
	match: TicketPosition
	betOption: BET_OPTIONS
}

const OddValue = (props: Props) => {
	const { match, betOption } = props
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	// TODO: refactore TicketPosition type and use Imatch type and remove as any
	return getOddByBetType(match as any, !!activeTicketValues.copied, betOption).formattedOdd > MIN_ODD_TRESHOLD ? (
		<SC.Odd>
			{getOddByBetType(match as any, !!activeTicketValues.copied, betOption).formattedOdd}
			{getOddByBetType(match as any, !!activeTicketValues.copied, betOption).rawBonus > 0 && (
				<SC.OddBonus>{getOddByBetType(match as any, !!activeTicketValues.copied, betOption).formattedBonus}</SC.OddBonus>
			)}
		</SC.Odd>
	) : null
}

export default OddValue
