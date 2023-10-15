import React from 'react'
import { useTranslation } from 'next-export-i18n'

import Button from '@/atoms/button/Button'
import Modal from '@/components/modal/Modal'
import Select from '@/atoms/select/Select'
import { SETTINGS_OPTIONS_ENUM } from '@/utils/constants'
import { SettingsSelect } from '@/components/settingsModal/SettingsModalStyles'
import * as SC from './SettingsModalStyles'

type Props = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = (props: Props) => {
	const { t } = useTranslation()
	const { visible, setVisible } = props
	const handleSubmitSettings = () => {
		// TODO: ukladat do local storage  + syncnut hodnotu z local storage
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
					<Select title={t('Quote display')} open={true} allowClear options={settingsOptions} placeholder={t('Select setting')} />
				</SettingsSelect>
			</SC.SettingsModalBody>
		</Modal>
	)
}

export default SettingsModal
