import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getFormValues } from 'redux-form'
import { useTranslation } from 'next-export-i18n'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'
import { FORM } from '@/utils/enums'
import Button from '@/atoms/button/Button'

type Props = {
	setCopyModal: React.Dispatch<React.SetStateAction<{ visible: boolean; onlyCopy: boolean }>>
	setTempMatches: React.Dispatch<React.SetStateAction<any[]>>
	activeMatches: any[]
}

const CopyTicketButton = ({ setCopyModal, setTempMatches, activeMatches }: Props) => {
	const { t } = useTranslation()
	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))

	return (
		<Button
			disabledPopoverText={t('Matches are no longer open to copy')}
			disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
			btnStyle={'primary'}
			content={t('Copy ticket')}
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
	)
}

export default CopyTicketButton
