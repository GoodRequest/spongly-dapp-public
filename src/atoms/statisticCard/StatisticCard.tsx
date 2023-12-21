import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import DocumentIcon from '@/assets/icons/document-icon.svg'

import * as SC from './StatisticCardStyles'

type Props = {
	value: string | number | null | undefined
	title: string
	isLoading?: boolean
	filled?: boolean
	img?: string
	showMobileInColumn?: boolean
	isAddress?: boolean
	isTxnHash?: boolean
	addMobileBackground?: boolean
	colorValue?: 'red' | 'green' | 'default'
	isMyWallet?: boolean
	onClick?: () => void
}
const StatisticCard = ({
	value,
	title,
	isLoading = false,
	filled = false,
	img,
	showMobileInColumn = false,
	isAddress = false,
	isTxnHash = false,
	addMobileBackground = false,
	colorValue = 'default',
	isMyWallet = false,
	onClick
}: Props) => (
	<SC.ColorWrapper filled={filled} onClick={onClick}>
		<SC.StatisticCard filled={filled} showMobileInColumn={showMobileInColumn} addMobileBackground={addMobileBackground}>
			{img && <SC.Image filled={filled} src={img} isAddress={isAddress} />}
			<SC.StatisticWrapper isTxnHash={isTxnHash} isAddress={isAddress}>
				{isMyWallet && <SC.Title>{title}</SC.Title>}
				{isAddress ? (
					<SC.AddressContainer>
						<SC.FirstAddressPart>{String(value)?.substring(0, String(value).length - 3)}</SC.FirstAddressPart>
						<SC.SecondAddressPart>{String(value)?.slice(-3)}</SC.SecondAddressPart>
					</SC.AddressContainer>
				) : (
					<SC.Value color={colorValue} filled={filled}>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : isTxnHash ? (
							<SC.TxWrapper>
								<SC.TxIcon src={DocumentIcon} alt='hash' />
								<SC.TxEllipsis>{value}</SC.TxEllipsis>
							</SC.TxWrapper>
						) : (
							value
						)}
					</SC.Value>
				)}
				{!isMyWallet && <SC.Title>{title}</SC.Title>}
			</SC.StatisticWrapper>
		</SC.StatisticCard>
	</SC.ColorWrapper>
)

export default StatisticCard
