import { FC, ReactNode, useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { useRouter } from 'next-translate-routes'
import { includes } from 'lodash'

import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import * as SC from './ContentStyles'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import ParlayLeaderboard from '@/components/parlayLeaderboard/ParlayLeaderboard'
import { PAGES } from '@/utils/enums'
import SBox from '@/components/sBox/SBox'
import BalanceIcon from '@/assets/icons/balanece-icon.svg'
import { GET_USERS_STATISTICS } from '@/utils/queries'
import { roundPrice } from '@/utils/formatters/currency'

interface ILayout {
	children: ReactNode
}

const Content: FC<ILayout> = ({ children }) => {
	const router = useRouter()
	const { id } = router.query
	const { t } = useTranslation()
	const fullWidthPages = [`/${PAGES.PARLAY_SUPERSTARS}`, `/${PAGES.LEADERBOARD}`]
	const userStatistics = [`/${PAGES.DASHBOARD}`]
	const [fetchUserStatistic] = useLazyQuery(GET_USERS_STATISTICS)
	const { address } = useAccount()
	const { chain } = useNetwork()
	const [statistics, setStatistics] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const { data } = useBalance({
		address
	})

	const fetchStats = async () => {
		try {
			setIsLoading(true)
			const { data } = await fetchUserStatistic({ variables: { id: address?.toLocaleLowerCase() }, context: { chainId: chain?.id } })
			setStatistics(data.user)
			setIsLoading(false)
		} catch (e) {
			setIsLoading(false)
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	useEffect(() => {
		fetchStats()
	}, [])
	return (
		<SC.MainContainer>
			<Row gutter={[30, 30]} style={{ display: 'flex', justifyContent: 'space-between' }}>
				{includes(userStatistics, router.pathname) && !isLoading && statistics && (
					<>
						<Col span={6}>
							<SBox title={t('Account balance')} value={`${Number(data?.formatted).toFixed(4)} ${data?.symbol}`} icon={BalanceIcon} />
						</Col>
						<Col span={6}>
							<SBox title={t('Profits')} value={`${roundPrice(statistics?.pnl)} $`} />
						</Col>
						<Col span={6}>
							<SBox title={t('Success rate')} value={'82.42%'} />
						</Col>
						<Col span={6}>
							<SBox title={t('My tickets')} value={statistics.trades} />
						</Col>
					</>
				)}

				{includes(fullWidthPages, router.pathname) && !id ? (
					<Col style={{ width: '100%' }} lg={24} xl={24}>
						{children}
					</Col>
				) : (
					<>
						<SC.MainContentContainer>{children}</SC.MainContentContainer>
						<SC.MobileHiddenCol span={8}>
							{router.pathname === `/${PAGES.DASHBOARD}` && <ParlayLeaderboard />}
							<TicketBetContainer />
						</SC.MobileHiddenCol>
					</>
				)}
			</Row>
		</SC.MainContainer>
	)
}

export default Content
