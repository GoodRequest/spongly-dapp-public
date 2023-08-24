import { change } from 'redux-form'
import { ThunkResult } from '../rootReducer'
import { TicketPosition } from './betTicketTypes'
import { FORM } from '@/utils/enums'
import { MAX_TICKET_MATCHES } from '@/utils/constants'

export const updateActiveTicketMatches =
	(match: TicketPosition, activeMatches?: TicketPosition[]): ThunkResult<any> =>
	(dispatch) => {
		// Check if the match is already in the active ticket
		if (activeMatches?.some((activeMatch) => activeMatch.gameId === match.gameId)) {
			const updatedMatches = activeMatches
				.map((activeMatch) => {
					if (activeMatch.gameId === match.gameId) {
						// Remove match from active ticket
						if (activeMatch.betOption === match.betOption) return undefined
						return match
					}
					return activeMatch
				})
				.filter(Boolean)

			dispatch(change(FORM.BET_TICKET, 'matches', updatedMatches))
			return updatedMatches
		}
		// Check if count of matches reach the cap
		if ((activeMatches?.length || 0) >= MAX_TICKET_MATCHES) {
			return null
		}
		// Add match to active ticket
		const matches = activeMatches ? [...activeMatches, match] : [match]
		dispatch(change(FORM.BET_TICKET, 'matches', matches))
		// Set that the ticket has been modified and according to this, the ticket that was not copied but edited will be made
		// dispatch(change(FORM.BET_TICKET, 'copied', false))
		return matches
	}
