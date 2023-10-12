import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount } from 'wagmi'
import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { getWalletImage } from '@/utils/images'
import { useIsMounted } from '@/hooks/useIsMounted'

type Props = {
	isLoading: boolean
	tipsterAddress?: string
	buyIn?: string | number
	quote?: string
	matches?: number
}

const TicketStatisticRow = ({ isLoading, tipsterAddress, buyIn, quote, matches }: Props) => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const isMounted = useIsMounted()
	const isMyWallet = tipsterAddress === address

	// NOTE: Number of copies, claim value missing atm, we can add claim though
	return (
		<Row gutter={[0, 32]}>
			{isMounted && (
				<>
					<Col lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(address as string)}
							filled={true}
							isAddress={true}
							value={address}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
						/>
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard showMobileInColumn={true} isLoading={isLoading} value={buyIn} title={t('Buy in')} />
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={quote} title={t('Quote')} />
					</Col>
					<Col lg={6} md={8} sm={8} xs={8}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={matches} title={t('Matches')} />
					</Col>
				</>
			)}
		</Row>
	)
}

export default TicketStatisticRow
