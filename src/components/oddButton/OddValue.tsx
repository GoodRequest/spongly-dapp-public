import React from 'react'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'

import * as SC from '@/components/oddButton/OddButtonStyles'
import { MIN_ODD_TRESHOLD, OddsType } from '@/utils/constants'
import { getOddByBetType } from '@/utils/helpers'
import { BET_OPTIONS, FORM } from '@/utils/enums'
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'
import { formatQuote } from '@/utils/formatters/quote'

type Props = {
	match: TicketPosition
	betOption: BET_OPTIONS
}
const OddValue = (props: Props) => {
	const { match, betOption } = props
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const actualOddType = typeof window !== 'undefined' ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL
	// TODO: refactore TicketPosition type and use Imatch type and remove as any
	return formatQuote(OddsType.DECIMAL, getOddByBetType(match as any, !!activeTicketValues.copied, actualOddType, betOption).rawOdd) > MIN_ODD_TRESHOLD ? (
		<SC.Odd>
			{getOddByBetType(match as any, !!activeTicketValues.copied, actualOddType, betOption).formattedOdd}
			{getOddByBetType(match as any, !!activeTicketValues.copied, actualOddType, betOption).rawBonus > 0 && (
				<SC.OddBonus>{getOddByBetType(match as any, !!activeTicketValues.copied, actualOddType, betOption).formattedBonus}</SC.OddBonus>
			)}
		</SC.Odd>
	) : null
}

export default OddValue
