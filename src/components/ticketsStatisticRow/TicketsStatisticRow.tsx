import { useTranslation } from 'next-export-i18n'
import { Row } from 'antd'
import { useAccount, useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { useIsMounted } from '@/hooks/useIsMounted'
import { User } from '@/typescript/types'
import { getWalletImage } from '@/utils/images'
import { roundPrice } from '@/utils/formatters/currency'

import * as SC from './TicketsStatisticRowStyles'
import * as SCS from '@/styles/GlobalStyles'

import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import SuccessIcon from '@/assets/icons/success-rate-statistics-icon.png'
import ProfitsTicketsIcon from '@/assets/icons/profits-tickets-statistics-icon.png'

type Props = {
	isLoading: boolean
	user: User | undefined
	isMyWallet?: boolean
}

const TicketsStatisticRow = ({ isLoading, user, isMyWallet }: Props) => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const isMounted = useIsMounted()
	const router = useRouter()

	return (
		<Row gutter={[0, 32]}>
			{isMounted && chain?.id && (
				<>
					<SC.StatisticCardCol lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(address as string)}
							filled={true}
							isAddress={true}
							value={isMounted ? (isMyWallet ? address : String(router.query.id) || '') : ''}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
						/>
					</SC.StatisticCardCol>
					<SC.StatisticCardCol lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							showMobileInColumn={true}
							isLoading={isLoading}
							img={SuccessIcon}
							value={isMounted ? `${user?.successRate ? user.successRate : 0} %` : ''}
							title={t('Success rate')}
						/>
					</SC.StatisticCardCol>
					<SC.StatisticCardCol lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							img={ProfitsTicketsIcon}
							value={isMounted ? `${user?.pnl && user?.pnl > 0 ? '+ ' : ''} ${roundPrice(user?.pnl)} $` : ''}
							title={t('Profits')}
						/>
					</SC.StatisticCardCol>
					<SC.StatisticCardCol lg={6} md={8} sm={8} xs={8}>
						<StatisticCard
							isLoading={isLoading}
							showMobileInColumn={true}
							img={ProfitsTicketsIcon}
							value={isMounted ? (user?.trades ? user.trades : 0) : 0}
							title={t('Tickets')}
						/>
					</SC.StatisticCardCol>
				</>
			)}
			{!chain?.id && (
				<SCS.Empty
					image={EmptyStateImage}
					description={
						<div>
							<p>{t('Please connect your wallet')}</p>
						</div>
					}
				/>
			)}
		</Row>
	)
}

export default TicketsStatisticRow
