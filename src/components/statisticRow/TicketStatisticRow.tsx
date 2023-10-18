import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount } from 'wagmi'
import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { getWalletImage } from '@/utils/images'
import { useIsMounted } from '@/hooks/useIsMounted'
import { USER_TICKET_TYPE } from '@/utils/constants'

type Props = {
	isLoading: boolean
	tipsterAddress?: string
	buyIn?: string | number
	quote?: string
	matches?: number
	claim?: string | number
	userTicketType?: USER_TICKET_TYPE
	// copies
}

const TicketStatisticRow = ({ isLoading, tipsterAddress, buyIn, quote, matches, claim, userTicketType }: Props) => {
	const { t } = useTranslation()
	const { address } = useAccount()
	const isMounted = useIsMounted()
	const isMyWallet = tipsterAddress === address

	// NOTE: Number of copies, claim value missing atm, we can add claim though
	return (
		<Row gutter={[8, 12]}>
			{isMounted && (
				<>
					<Col lg={5} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(address as string)}
							filled={true}
							isAddress={true}
							value={address}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
						/>
					</Col>
					<Col lg={5} md={12} sm={12} xs={12}>
						<StatisticCard showMobileInColumn={true} isLoading={isLoading} value={buyIn} title={t('Buy in')} addMobileBackground={true} />
					</Col>
					<Col lg={5} md={12} sm={12} xs={12}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={quote} title={t('Quote')} addMobileBackground={true} />
					</Col>
					<Col lg={4} md={12} sm={12} xs={12}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={matches} title={t('Matches')} addMobileBackground={true} />
					</Col>
					<Col lg={5} md={12} sm={12} xs={12}>
						<StatisticCard
							colorValue={userTicketType === USER_TICKET_TYPE.SUCCESS ? 'green' : userTicketType === USER_TICKET_TYPE.MISS ? 'red' : 'default'}
							isLoading={isLoading}
							showMobileInColumn={true}
							value={claim}
							title={t('Claim')}
							addMobileBackground={true}
						/>
					</Col>
				</>
			)}
		</Row>
	)
}

export default TicketStatisticRow
