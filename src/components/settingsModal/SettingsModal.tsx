import React, { useState } from 'react'
import { useTranslation } from 'next-export-i18n'

import Button from '@/atoms/button/Button'
import Modal from '@/components/modal/Modal'
import Select from '@/atoms/select/Select'
import { SETTINGS_OPTIONS_ENUM } from '@/utils/constants'
import { SettingsSelect } from '@/components/settingsModal/SettingsModalStyles'
import * as SC from './SettingsModalStyles'
import { isWindowReady } from '@/utils/helpers'

type Props = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = (props: Props) => {
	const { t } = useTranslation()
	const { visible, setVisible } = props
	const defaultValue = typeof window !== 'undefined' ? localStorage.getItem('oddType') || SETTINGS_OPTIONS_ENUM.DECIMAL : SETTINGS_OPTIONS_ENUM.DECIMAL

	const [value, setValue] = useState(defaultValue)
	console.log('value', value)
	const handleSubmitSettings = () => {
		if (isWindowReady()) {
			// TODO: ukladat do local storage  + syncnut hodnotu z local storage
			setVisible(false)
			localStorage.setItem('oddType', value)
		}
	}

	const settingsOptions = [
		{
			label: t('Normalized Implied Odds'),
			value: SETTINGS_OPTIONS_ENUM.NORMALIZED
		},
		{
			label: t('Decimal Odds'),
			value: SETTINGS_OPTIONS_ENUM.DECIMAL
		},
		{
			label: t('American Odds'),
			value: SETTINGS_OPTIONS_ENUM.AMERICAN
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
