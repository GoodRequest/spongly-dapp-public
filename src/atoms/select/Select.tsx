import { Select as AntdSelect, SelectProps } from 'antd'

import * as SC from './SelectStyles'

type Props = SelectProps & {
	onChange?: (value: any) => void
	useSelectContainer?: boolean
	popUpClassName?: string // TODO: popupClassName exists on antd select type 5.8. + (when update package use it instead of custom)
}

const Select = ({ options, defaultValue, onChange, value, className, placement, useSelectContainer = true, popUpClassName }: Props) => {
	const selectOptions = options?.map((option) => {
		return (
			<AntdSelect.Option Option key={option?.value}>
				{option?.label}
			</AntdSelect.Option>
		)
	})

	return (
		<SC.SelectWrapper id={`select-container`}>
			<SC.Select
				size={'large'}
				value={value}
				onChange={onChange}
				className={className}
				defaultValue={defaultValue}
				placement={placement || 'bottomRight'}
				popupClassName={popUpClassName}
				getPopupContainer={() => (useSelectContainer ? document.getElementById(`select-container`) || document.body : document.body)}
			>
				{selectOptions}
			</SC.Select>
		</SC.SelectWrapper>
	)
}

export default Select
