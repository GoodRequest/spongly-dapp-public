import { Select as AntdSelect, SelectProps } from 'antd'
import Flag from 'react-world-flags'

import { Option } from '@/typescript/types'

import * as SC from './MobileSelectStyles'
import * as SCS from '@/styles/GlobalStyles'

import { Icon } from '@/styles/Icons'
import { STATIC } from '@/utils/constants'

export type IMobileSelectItem = {
	country?: string
	img?: string
} & Option

type Props = SelectProps & {
	onChange?: (value: any) => void
	title?: string | null
}

const MobileSelect = ({ options, defaultValue, onChange, value, title }: Props) => {
	const selectOptions = options?.map((option) => {
		return (
			<AntdSelect.Option key={option?.value}>
				<SC.MobileOptionWrapper>
					{option.img && <Icon className={`icon icon--${option.img}`} />}
					{option.country && option.country !== STATIC.WORLD && <Flag code={option.country} className={'flag'} />}
					{option.country && option.country === STATIC.WORLD && <SCS.FlagWorld />}
					{option?.label}
				</SC.MobileOptionWrapper>
			</AntdSelect.Option>
		)
	})

	return (
		<div>
			{title && <SC.Title>{title}</SC.Title>}
			<SC.MobileSelectWrapper id={'select-container'}>
				<SC.MobileSelect
					size={'large'}
					value={value}
					onChange={onChange}
					defaultValue={defaultValue}
					getPopupContainer={() => document.getElementById('select-container') || document.body}
				>
					{selectOptions}
				</SC.MobileSelect>
			</SC.MobileSelectWrapper>
		</div>
	)
}

export default MobileSelect
