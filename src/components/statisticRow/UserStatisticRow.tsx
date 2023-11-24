import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useAccount } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { useIsMounted } from '@/hooks/useIsMounted'
import { User } from '@/typescript/types'
import { getWalletImage } from '@/utils/images'
import { roundPrice } from '@/utils/formatters/currency'

import SuccessRateIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsTicketsIcon from '@/assets/icons/stat-profits-icon.svg'
import TicketsIcon from '@/assets/icons/stat-balance-icon.svg'
import WalletIcon from '@/assets/icons/walletIcons/WalletIcon.svg'

import * as SC from './UserStatisticRowStyles'

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

	// https://ipfs.synthetix.io/ipns/k2k4r8jwpiyedp0cq2vit524ab75e15lauc4ubwi88tsnq4wapj437bj/baseMainnet.json
	// https://ipfs.synthetix.io/ipns/k2k4r8jwpiyedp0cq2vit524ab75e15lauc4ubwi88tsnq4wapj437bj/optimisticEthereum.json
	// https://ipfs.synthetix.io/ipns/k2k4r8jwpiyedp0cq2vit524ab75e15lauc4ubwi88tsnq4wapj437bj/arbitrumOne.json
	return (
		<SC.StatisticsWrapper justify={'space-between'}>
			<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
				<Row>
					<Col span={24}>
						<SC.MyWalletText>{t('My Wallet')}</SC.MyWalletText>
					</Col>
					<Col span={24}>
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
						<SC.MyWalletText>{t('TODO TABS')}</SC.MyWalletText>
					</Col>
				</Row>
			</Col>
			<Col style={{ display: 'flex', alignItems: 'center' }}>
				<img src={WalletIcon} alt='wallet-icon' width={275} height={275} />
			</Col>
		</SC.StatisticsWrapper>
	)

	// return (
	// 	<Row gutter={[0, 32]}>
	// 		<>
	// 			<Col lg={6} md={24} sm={24} xs={24}>
	// 				<StatisticCard
	// 					img={getWalletImage(address as string)}
	// 					filled={true}
	// 					isAddress={true}
	// 					value={isMounted ? (isMyWallet ? address : String(router.query.id) || '') : ''}
	// 					title={isMyWallet ? t('My wallet') : t('Wallet')}
	// 					isMyWallet={isMyWallet}
	// 				/>
	// 			</Col>
	// 			<Col lg={6} md={8} sm={8} xs={8}>
	// 				<StatisticCard
	// 					showMobileInColumn={true}
	// 					isLoading={isLoading}
	// 					img={SuccessRateIcon}
	// 					value={isMounted ? `${user?.successRate ? user.successRate : 0} %` : ''}
	// 					title={t('Success rate')}
	// 				/>
	// 			</Col>
	// 			<Col lg={6} md={8} sm={8} xs={8}>
	// 				<StatisticCard
	// 					isLoading={isLoading}
	// 					showMobileInColumn={true}
	// 					img={ProfitsTicketsIcon}
	// 					value={isMounted ? `${user?.pnl && user?.pnl > 0 ? '+' : ''}${roundPrice(user?.pnl)} $` : ''}
	// 					title={t('Profits')}
	// 				/>
	// 			</Col>
	// 			<Col lg={6} md={8} sm={8} xs={8}>
	// 				<StatisticCard
	// 					isLoading={isLoading}
	// 					showMobileInColumn={true}
	// 					img={TicketsIcon}
	// 					value={isMounted ? (user?.trades ? user.trades : 0) : 0}
	// 					title={t('Tickets')}
	// 				/>
	// 			</Col>
	// 		</>
	// 	</Row>
	// )
}

export default UserStatisticRow
