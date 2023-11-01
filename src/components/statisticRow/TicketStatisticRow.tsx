import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import StatisticCard from '@/atoms/statisticCard/StatisticCard'
import { getWalletImage } from '@/utils/images'
import { useIsMounted } from '@/hooks/useIsMounted'
import { USER_TICKET_TYPE } from '@/utils/constants'
import { handleTxHashRedirect } from '@/utils/helpers'
import { PAGES } from '@/utils/enums'

type Props = {
	isLoading: boolean
	tipsterAddress?: string
	buyIn?: string | number
	quote?: string
	matches?: number
	claim?: string | number
	userTicketType?: USER_TICKET_TYPE
	txHash?: string
	isMyWallet: boolean
}

const TicketStatisticRow = ({ isLoading, tipsterAddress, buyIn, quote, matches, claim, userTicketType, txHash, isMyWallet }: Props) => {
	const { t } = useTranslation()
	const isMounted = useIsMounted()
	const { chain } = useNetwork()
	const router = useRouter()
	return (
		<Row gutter={[8, 12]}>
			{isMounted && (
				<>
					<Col lg={6} md={24} sm={24} xs={24}>
						<StatisticCard
							img={getWalletImage(tipsterAddress as string)}
							filled={true}
							isAddress={true}
							isLoading={isLoading}
							onClick={() => router.push(`/${PAGES.TIPSTER_DETAIL}/?id=${tipsterAddress}`)}
							value={tipsterAddress}
							title={isMyWallet ? t('My wallet') : t('Wallet')}
							isMyWallet={isMyWallet}
						/>
					</Col>
					<Col lg={4} md={24} sm={24} xs={24}>
						<StatisticCard
							showMobileInColumn={true}
							isTxnHash={true}
							isLoading={isLoading}
							value={txHash}
							title={t('Txn hash')}
							addMobileBackground={true}
							onClick={() => handleTxHashRedirect(t, txHash, chain?.id)}
						/>
					</Col>
					<Col lg={4} md={12} sm={12} xs={12}>
						<StatisticCard showMobileInColumn={true} isLoading={isLoading} value={buyIn} title={t('Buy-in')} addMobileBackground={true} />
					</Col>
					<Col lg={3} md={12} sm={12} xs={12}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={quote} title={t('Quote')} addMobileBackground={true} />
					</Col>
					<Col lg={3} md={12} sm={12} xs={12}>
						<StatisticCard isLoading={isLoading} showMobileInColumn={true} value={matches} title={t('Matches')} addMobileBackground={true} />
					</Col>
					<Col lg={4} md={12} sm={12} xs={12}>
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
