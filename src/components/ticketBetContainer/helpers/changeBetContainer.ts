import { isEqual } from 'lodash'
import { change } from 'redux-form'
import { ACTIVE_TICKET_PROCESSING } from '@/redux/betTickets/betTicketTypes'
import { FORM } from '@/utils/enums'

const handleOnchangeForm = async (values: any, dispatch: any, props: any, prevValues: any) => {
	const valueOptions = values.matches.map((match: any) => match.betOption)
	const prevValueOptions = prevValues.matches?.map((match: any) => match.betOption) || []
	// NOTE: Trigger recalculate ticket only if those values changed
	if (values.matches.length === 0) return
	const shouldCalculate =
		values.available !== prevValues.available ||
		values.buyIn !== prevValues.buyIn ||
		values.selectedStablecoin !== prevValues.selectedStablecoin ||
		values.matches.length !== prevValues.matches.length ||
		!isEqual(valueOptions, prevValueOptions)
	if ((shouldCalculate && values.buyIn) || values.payout === 0) {
		try {
			dispatch({ type: ACTIVE_TICKET_PROCESSING.SET, payload: true })
			const ticketData = await props?.fetchTicketData()
			const allowance = await props?.getAllowance()

			await Promise.all([
				dispatch(change(FORM.BET_TICKET, 'allowance', allowance)),
				dispatch(change(FORM.BET_TICKET, 'payout', ticketData.payout)),
				dispatch(change(FORM.BET_TICKET, 'potentionalProfit', ticketData.potentionalProfit)),
				dispatch(change(FORM.BET_TICKET, 'totalBonus', ticketData.totalBonus)),
				dispatch(change(FORM.BET_TICKET, 'totalQuote', ticketData.totalQuote)),
				dispatch(change(FORM.BET_TICKET, 'maxBuyIn', ticketData.maxBuyIn))
			])
		} catch (e) {
			dispatch(change(FORM.BET_TICKET, 'matches', []))
		} finally {
			dispatch({ type: ACTIVE_TICKET_PROCESSING.SET, payload: false })
		}
	}
}

export default handleOnchangeForm
