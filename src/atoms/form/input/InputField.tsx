import React from 'react'
import { Input as AntdInput, InputProps } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import * as SC from './InputFieldStyles'

type Props = WrappedFieldProps &
	InputProps & {
		autocomplete: string
		notChangeOnError: boolean
	}

const InputField = (props: Props) => {
	const {
		maxLength,
		input,
		type,
		placeholder,
		style,
		autocomplete,
		meta: { touched, error },
		notChangeOnError,
		disabled,
		min,
		max,
		readOnly,
		size
	} = props

	return (
		<SC.StyledInput style={style} error={touched && error && !notChangeOnError}>
			<AntdInput
				{...input}
				size={size}
				disabled={disabled}
				readOnly={readOnly}
				className={'input'}
				min={type === 'number' ? min : undefined}
				max={type === 'number' ? max : undefined}
				type={type || 'text'}
				placeholder={placeholder || ''}
				autoComplete={autocomplete}
				maxLength={maxLength}
			/>
			{touched && error && <SC.ErrorMessage>{error}</SC.ErrorMessage>}
		</SC.StyledInput>
	)
}

export default React.memo(InputField)
