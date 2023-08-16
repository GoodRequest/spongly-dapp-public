import React, { FC } from 'react'
import { WrappedFieldProps } from 'redux-form'
import { RadioGroupProps } from 'antd'
import * as SC from './RadioFieldStyles'

type Props = WrappedFieldProps & RadioGroupProps

const RadioField: FC<Props> = ({ input, options, meta: { touched, error }, value }) => {
	const handleOnChange = ({ target }: any) => {
		input.onChange(target.value)
	}

	return (
		<>
			<SC.RadioGroup options={options} onChange={handleOnChange} optionType={'button'} buttonStyle={'solid'} value={value || input.value} />
			{touched && error && <SC.ErrorMessage>{error}</SC.ErrorMessage>}
		</>
	)
}

export default RadioField
