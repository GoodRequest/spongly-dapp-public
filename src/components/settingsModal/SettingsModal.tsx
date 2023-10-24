import React, { useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'
import { change, getFormValues } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@/atoms/button/Button'
import Modal from '@/components/modal/Modal'
import Select from '@/atoms/select/Select'
import { SettingsSelect } from '@/components/settingsModal/SettingsModalStyles'
import * as SC from './SettingsModalStyles'
import { isWindowReady } from '@/utils/helpers'
import { OddsType } from '@/utils/constants'
import { FORM } from '@/utils/enums'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { formatQuote } from '@/utils/formatters/quote'

type Props = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = (props: Props) => {
	const { t } = useTranslation()
	const { visible, setVisible } = props
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL
	const router = useRouter()
	const dispatch = useDispatch()
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const [value, setValue] = useState(actualOddType)
	const handleSubmitSettings = () => {
		if (isWindowReady()) {
			setVisible(false)
			localStorage.setItem('oddType', value)
			// NOTE: re-mount page after change oddType
			router.replace(router.asPath)
			// NOTE: change quote in BET_CONTAINER after change of type
			dispatch(change(FORM.BET_TICKET, 'totalQuote', formatQuote(value, activeTicketValues.rawQuote)))
		}
	}

	const settingsOptions = [
		{
			label: t('Normalized Implied Odds'),
			value: OddsType.AMM
		},
		{
			label: t('Decimal Odds'),
			value: OddsType.DECIMAL
		},
		{
			label: t('American Odds'),
			value: OddsType.AMERICAN
		}
	]
	return (
		<Modal
			footer={<Button btnStyle={'primary'} content={t('Confirm')} onClick={handleSubmitSettings} />}
			title={'Settings'}
			open={visible}
			onCancel={() => setVisible(false)}
			centered
		>
			<SC.SettingsModalBody>
				<SettingsSelect>
					<Select
						onChange={(val) => setValue(val)}
						popupClassName={'checkbox-dropdown'}
						title={t('Quote display')}
						value={value}
						options={settingsOptions}
						placeholder={t('Select setting')}
					/>
				</SettingsSelect>
			</SC.SettingsModalBody>
		</Modal>
	)
}

export default SettingsModal
