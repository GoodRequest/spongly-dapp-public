import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useAccount } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import { includes } from 'lodash'
import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { useIsMounted } from '@/hooks/useIsMounted'
import { User } from '@/typescript/types'
import { getWalletImage } from '@/utils/images'
import { roundPrice } from '@/utils/formatters/currency'
import { useMedia } from '@/hooks/useMedia'

// import SuccessRateIcon from '@/assets/icons/stat-successrate-icon.svg'
// import ProfitsTicketsIcon from '@/assets/icons/stat-profits-icon.svg'
// import TicketsIcon from '@/assets/icons/stat-balance-icon.svg'
import WalletIcon from '@/assets/icons/walletIcons/WalletIcon.svg'
import WalletIconSmall from '@/assets/icons/walletIcons/WalletIconSmall.svg'

import * as SC from './UserStatisticRowStyles'
import Tabs, { TabItem } from '@/atoms/tabs/Tabs'
import { RESOLUTIONS } from '@/utils/enums'
import TabContent from './TabContent/TabContent'
import { isBellowOrEqualResolution } from '@/utils/helpers'

type Props = {
	isLoading: boolean
	user: User | undefined
	isMyWallet?: boolean
}

const UserStatisticRow = ({ isLoading, user, isMyWallet }: Props) => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const isMounted = useIsMounted()
	const router = useRouter()

	const size = useMedia()

	const tabItems: TabItem[] = [
		{
			key: 'overall',
			label: `${t('Overall')}`,
			children: (
				<TabContent successRate={user?.overAll?.successRate} ticketCount={user?.overAll?.trades} profits={user?.overAll?.pnl} isLoading={isLoading} />
			)
		},
		{
			key: 'last-months',
			label: `${t('Last months')}`,
			children: (
				<TabContent successRate={user?.monthly?.successRate} ticketCount={user?.monthly?.trades} profits={user?.overAll?.pnl} isLoading={isLoading} />
			)
		}
	]

	return (
		<SC.StatisticsWrapper justify={'space-between'}>
			<SC.ValuesContainer flex={'auto'}>
				<Row>
					<Col span={24}>
						<SC.MyWalletText>{isMyWallet ? t('My Wallet') : t('Tipster')}</SC.MyWalletText>
					</Col>
					<Col md={24}>
						{isMounted && (
							<SC.AddressContainer>
								<SC.FirstAddressPart>
									{String(isMyWallet ? address : String(router.query.id) || '')?.substring(
										0,
										String(isMyWallet ? address : String(router.query.id) || '').length - 3
									)}
								</SC.FirstAddressPart>
								<SC.SecondAddressPart>{String(isMyWallet ? address : String(router.query.id) || '')?.slice(-3)}</SC.SecondAddressPart>
							</SC.AddressContainer>
						)}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Tabs items={tabItems} />
					</Col>
				</Row>
			</SC.ValuesContainer>
			<SC.WalletImageWrapper>
				{isBellowOrEqualResolution(size, RESOLUTIONS.LG) ? (
					<SC.WalletIcon imageSrc={getWalletImage(address as string)} />
				) : (
					<SC.WalletIcon imageSrc={getWalletImage(address as string)} />
				)}
			</SC.WalletImageWrapper>
		</SC.StatisticsWrapper>
	)
}

export default UserStatisticRow
