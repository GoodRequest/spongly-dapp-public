import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useAccount } from 'wagmi'
import { useRouter } from 'next-translate-routes'
import { useIsMounted } from '@/hooks/useIsMounted'
import { User } from '@/typescript/types'
import * as SC from './UserStatisticRowStyles'
import Tabs from '@/components/tabs/Tabs'
import TabContent from './TabContent/TabContent'
import { getWalletImage } from '@/utils/images'

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

	const tabItems = [
		{
			key: 'overall',
			label: t('Overall'),
			children: (
				<TabContent successRate={user?.overAll?.successRate} ticketCount={user?.overAll?.trades} profit={user?.overAll?.pnl} isLoading={isLoading} />
			)
		},
		{
			key: 'last-month',
			label: t('Last month'),
			children: (
				<TabContent successRate={user?.monthly?.successRate} ticketCount={user?.monthly?.trades} profit={user?.monthly?.pnl} isLoading={isLoading} />
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
				<SC.WalletIcon imageSrc={getWalletImage(address || '-')} />
			</SC.WalletImageWrapper>
		</SC.StatisticsWrapper>
	)
}

export default UserStatisticRow
