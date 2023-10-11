import React from 'react'
import { useTranslation } from 'next-export-i18n'
import * as SC from './SBoxStyles'

type Props = {
	title: string
	value: string
	icon?: any
}

const SBox = ({ title, value, icon }: Props) => {
	const { t } = useTranslation()
	return (
		<SC.SBoxWrapper>
			<SC.SCColWrapper>
				<SC.SBoxTitle>{title}</SC.SBoxTitle>
				<SC.SBoxValue>{value}</SC.SBoxValue>
			</SC.SCColWrapper>
			{icon && <SC.SBoxIcon src={icon} alt={'stat'} />}
		</SC.SBoxWrapper>
	)
}

export default SBox
