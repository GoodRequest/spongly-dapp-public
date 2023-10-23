import { Select as AntdSelect, SelectProps } from 'antd'

import React, { useState } from 'react'
import * as SC from './SelectStyles'
import ClearIcon from '@/assets/icons/x-close.svg'
import { breakpoints } from '@/styles/theme'

type Props = SelectProps & {
	onChange?: (value: any) => void
	useSelectContainer?: boolean
	title?: string | null | JSX.Element
}

const Select = ({
	options,
	defaultValue,
	onChange,
	value,
	className,
	placement,
	useSelectContainer,
	popupClassName,
	title,
	placeholder,
	open,
	allowClear
}: Props) => {
	const selectOptions = options?.map((option) => {
		return (
			<AntdSelect.Option Option key={option?.value}>
				{option.label}
			</AntdSelect.Option>
		)
	})
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const handleDropdownOpenChange = (open: boolean) => {
		setIsDropdownOpen(open)
	}
	const bodyStyle = `
		<style>
			body {
				@media (max-width: ${breakpoints.md}px) {
	            	overflow: hidden;
				}
	         }
		</style>
	`
	return (
		<SC.SelectWrapper id={'select-container'}>
			{/* eslint-disable-next-line react/no-danger */}
			{isDropdownOpen && <div dangerouslySetInnerHTML={{ __html: bodyStyle }} />}
			{title && <SC.Title>{title}</SC.Title>}
			<SC.Select
				size={'large'}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				className={className}
				open={open}
				onDropdownVisibleChange={handleDropdownOpenChange}
				defaultValue={defaultValue}
				allowClear={allowClear}
				clearIcon={<img src={ClearIcon} width={16} height={16} alt='clear' />}
				placement={placement || 'bottomRight'}
				popupClassName={popupClassName}
				getPopupContainer={() => (useSelectContainer ? document.getElementById(`select-container`) || document.body : document.body)}
			>
				{selectOptions}
			</SC.Select>
		</SC.SelectWrapper>
	)
}

export default Select
