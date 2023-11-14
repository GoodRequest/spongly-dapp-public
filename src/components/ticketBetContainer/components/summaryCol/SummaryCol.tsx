import { FC } from 'react'
import { Col } from 'antd'

import * as SC from './SummaryColStyles'

const SummaryCol: FC<{ title: string; value: string | number | JSX.Element; align?: 'right' | 'left'; isProfit?: boolean }> = ({
	title,
	value,
	isProfit,
	align
}) => {
	return (
		<Col span={12} style={{ textAlign: align, display: 'flex', alignItems: 'center', justifyContent: align }}>
			<SC.SummaryColTitle>{title}: </SC.SummaryColTitle>
			<SC.SummaryColValue isProfit={isProfit}>{value}</SC.SummaryColValue>
		</Col>
	)
}

export default SummaryCol
