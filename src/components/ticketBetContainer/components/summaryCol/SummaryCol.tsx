import { FC } from 'react'
import { Col } from 'antd'

import * as SC from './SummaryColStyles'

const SummaryCol: FC<{ title: string; value: string | number; align?: 'right' | 'left' }> = ({ title, value, align }) => {
	return (
		<Col span={12} style={{ textAlign: align }}>
			<SC.SummaryColTitle>{title}: </SC.SummaryColTitle>
			<SC.SummaryColValue>{value}</SC.SummaryColValue>
		</Col>
	)
}

export default SummaryCol
