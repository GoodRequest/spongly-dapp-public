import { useTranslation } from 'next-export-i18n'
import { Row } from 'antd'
import { useAccount, useNetwork } from 'wagmi'

import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { roundPrice } from '@/utils/helpers'
import { useIsMounted } from '@/hooks/useIsMounted'
import { User } from '@/typescript/types'

import * as SC from './TicketsStatisticRowStyles'

import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import SuccessIcon from '@/assets/icons/success-rate-statistics-icon.png'
import ProfitsTicketsIcon from '@/assets/icons/profits-tickets-statistics-icon.png'
import { getWalletImage } from '@/utils/images'

type Props = {
	isLoading: boolean
	user: User | undefined
}

const TicketsStatisticRow = ({ isLoading, user }: Props) => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const isMounted = useIsMounted()

	return (
		<Row gutter={[0, 32]}>
			{isMounted && chain?.id && (
				<>
					<SC.StatisticCardCol lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(address as string)}
							filled={true}
							isAddress={true}
							value={isMounted ? address || '' : ''}
							title={t('My wallet')}
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
				<SC.Empty
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