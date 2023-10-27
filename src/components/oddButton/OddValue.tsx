import React from 'react'

import * as SC from '@/components/oddButton/OddButtonStyles'
import { MIN_ODD_TRESHOLD, OddsType } from '@/utils/constants'
import { getOddByBetType, isWindowReady } from '@/utils/helpers'
import { BET_OPTIONS } from '@/utils/enums'
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'
import { formatQuote } from '@/utils/formatters/quote'

type Props = {
	match: TicketPosition
	betOption: BET_OPTIONS
}
const OddValue = (props: Props) => {
	const { match, betOption } = props
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

	// TODO: refactore TicketPosition type and use Imatch type and remove as any
	return formatQuote(OddsType.DECIMAL, getOddByBetType(match as any, actualOddType, betOption).rawOdd) > MIN_ODD_TRESHOLD ? (
		<SC.Odd>
			{getOddByBetType(match as any, actualOddType, betOption).formattedOdd}
			{getOddByBetType(match as any, actualOddType, betOption).rawBonus > 0 && (
				<SC.OddBonus>{getOddByBetType(match as any, actualOddType, betOption).formattedBonus}</SC.OddBonus>
			)}
		</SC.Odd>
	) : null
}

export default OddValue
