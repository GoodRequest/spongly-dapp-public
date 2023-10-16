import React, { useState } from 'react'
import { useTranslation } from 'next-export-i18n'

import { useRouter } from 'next-translate-routes'
import Button from '@/atoms/button/Button'
import Modal from '@/components/modal/Modal'
import Select from '@/atoms/select/Select'
import { SettingsSelect } from '@/components/settingsModal/SettingsModalStyles'
import * as SC from './SettingsModalStyles'
import { isWindowReady } from '@/utils/helpers'
import { OddsType } from '@/utils/constants'

type Props = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = (props: Props) => {
	const { t } = useTranslation()
	const { visible, setVisible } = props
	const defaultValue = typeof window !== 'undefined' ? localStorage.getItem('oddType') || OddsType.DECIMAL : OddsType.DECIMAL
	const router = useRouter()

	const [value, setValue] = useState(defaultValue)
	const handleSubmitSettings = () => {
		if (isWindowReady()) {
			setVisible(false)
			localStorage.setItem('oddType', value)
			// NOTE: reumnout page after change oddType
			router.replace(router.asPath)
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
