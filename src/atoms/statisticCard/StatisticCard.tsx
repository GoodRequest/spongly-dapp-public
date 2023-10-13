import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import * as SC from './StatisticCardStyles'

type Props = {
	value: string | number | null | undefined
	title: string
	isLoading?: boolean
	filled?: boolean
	img?: string
	showMobileInColumn?: boolean
	isAddress?: boolean
	addMobileBackground?: boolean
}
const StatisticCard = ({
	value,
	title,
	isLoading = false,
	filled = false,
	img,
	showMobileInColumn = false,
	isAddress = false,
	addMobileBackground = false
}: Props) => (
	<SC.ColorWrapper filled={filled}>
		<SC.StatisticCard filled={filled} showMobileInColumn={showMobileInColumn} addMobileBackground={addMobileBackground}>
			{img && <SC.Image filled={filled} src={img} />}
			<SC.StatisticWrapper isAddress={isAddress}>
				<SC.Title>{title}</SC.Title>
				{isAddress ? (
					<SC.AddressContainer>
						<SC.FirstAddressPart>{String(value)?.substring(0, String(value).length - 3)}</SC.FirstAddressPart>
						<SC.SecondAddressPart>{String(value)?.slice(-3)}</SC.SecondAddressPart>
					</SC.AddressContainer>
				) : (
					<SC.Value filled={filled}>{isLoading ? <Spin indicator={<LoadingOutlined spin />} /> : value}</SC.Value>
				)}
			</SC.StatisticWrapper>
		</SC.StatisticCard>
	</SC.ColorWrapper>
)

export default StatisticCard
