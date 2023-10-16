import React from 'react'
import * as SC from './SBoxStyles'

type Props = {
	title: string
	value: string | number
	extraContent?: any
}

const SBox = ({ title, value, extraContent }: Props) => {
	return (
		<SC.SBoxWrapper>
			<SC.SBoxColWrapper>
				<SC.SBoxTitle>{title}</SC.SBoxTitle>
				<SC.SBoxValue>{value}</SC.SBoxValue>
			</SC.SBoxColWrapper>
			<SC.SBoxExtraContent>{extraContent}</SC.SBoxExtraContent>
		</SC.SBoxWrapper>
	)
}

export default SBox
