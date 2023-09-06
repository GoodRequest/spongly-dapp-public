import React, { useEffect, useState } from 'react'
import { Select as AntdSelect, SelectProps } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { get, isArray, isObject, map } from 'lodash'

import * as SC from './SelectFieldStyles'

declare module 'react' {
	function forwardRef<T, P = {}>(
		render: (props: P, ref?: React.Ref<T>) => React.ReactElement | null
	): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

type Props = SelectProps & {
	onChange?: (value: any) => void
	onFocus?: () => void
	onBlur?: () => void
	options?: React.ReactNode[]
	customClass?: string
	bolded?: boolean
	width?: number
	isError?: boolean
	useBodyAsPopupContainer?: boolean
	popupClassName?: string
}

export const Select = React.forwardRef(
	(
		{
			value,
			onChange,
			options,
			placeholder,
			className = '',
			mode,
			labelInValue,
			customClass = '',
			optionLabelProp,
			notFoundContent,
			bordered,
			bolded,
			width,
			isError,
			onFocus,
			defaultValue,
			disabled,
			onBlur = () => {},
			useBodyAsPopupContainer = false,
			popupClassName,
			dropdownRender = (dropdownOptions) => <SC.DropdownWrapper>{dropdownOptions}</SC.DropdownWrapper>
		}: Props,
		ref?: React.ForwardedRef<typeof AntdSelect>
	) => {
		const v = value === null || value === '' ? undefined : value
		const [isOpen, setIsOpen] = useState(false)

		const normalizeValue = (valueArg: any) => {
			let normalizedValue
			if (isArray(valueArg)) {
				normalizedValue = map(valueArg, (val) => {
					const mLabel = isArray(get(val, 'label')) ? get(v, 'label[0].props.label') : get(val, 'label')
					return { ...val, label: mLabel }
				})
			} else if (isObject(valueArg)) {
				const mLabel = isArray(get(valueArg, 'label')) ? get(valueArg, 'label[0].props.label') : get(valueArg, 'label')
				normalizedValue = { ...valueArg, label: mLabel }
			} else {
				normalizedValue = valueArg
			}
			return normalizedValue
		}

		const onInputChange = (valueArg: any) => {
			let val
			if (onChange) {
				if (mode === 'multiple' || mode === 'tags') {
					val = map(valueArg, (arrayValue) => normalizeValue(arrayValue))
				} else {
					val = normalizeValue(valueArg)
				}

				onChange(val)
				setIsOpen(false)
			}
		}

		const handleOnBlur = (e: any) => {
			e.preventDefault()
			e.stopPropagation()
			setIsOpen(false)
			onBlur()
		}

		const onScroll = () => {
			if (isOpen) {
				setIsOpen(false)
				onBlur()
			}
		}

		useEffect(() => {
			window.addEventListener('scroll', onScroll)
			return () => {
				window.removeEventListener('scroll', onScroll)
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isOpen])

		const renderPlaceholder = (omittedValues: any[] = []) => <p>{`+ ${omittedValues.length}`}</p>
		return (
			<SC.SelectWrapper className={`${className} ${customClass}`} width={width} bordered={bordered} bolded={bolded} isError={isError}>
				<AntdSelect
					ref={ref as any}
					style={{ width: '100%' }}
					value={v}
					defaultValue={defaultValue}
					mode={mode}
					labelInValue={labelInValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={onInputChange}
					onBlur={handleOnBlur}
					onClick={() => setIsOpen((current) => !current)}
					onFocus={onFocus}
					open={isOpen}
					optionLabelProp={optionLabelProp}
					className={customClass}
					maxTagCount={1}
					maxTagPlaceholder={renderPlaceholder}
					defaultActiveFirstOption={false}
					popupClassName={popupClassName}
					getPopupContainer={(trigger: HTMLElement) => (useBodyAsPopupContainer ? document.body : (trigger?.parentNode?.parentNode as HTMLElement))}
					notFoundContent={notFoundContent}
					optionFilterProp={'label'}
					dropdownRender={dropdownRender}
				>
					{options}
				</AntdSelect>
			</SC.SelectWrapper>
		)
	}
)

export interface ISelectField extends Props {
	bottomMargin?: number
}

const SelectField: React.FC<WrappedFieldProps & ISelectField> = (
	{ input, meta: { touched, error }, ...restProps },
	ref?: React.ForwardedRef<typeof AntdSelect>
) => {
	return (
		<SC.SelectWrapper>
			<Select {...restProps} ref={ref} isError={touched ? !!error : false} value={input.value} onChange={input.onChange} />
		</SC.SelectWrapper>
	)
}

export default React.forwardRef(SelectField)
