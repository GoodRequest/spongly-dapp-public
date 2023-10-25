import React, { FC, ReactNode } from 'react'
import { Row } from 'antd'
import { useRouter } from 'next-translate-routes'
import { includes } from 'lodash'
import { useNetwork } from 'wagmi'

import * as SC from './ContentStyles'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import ParlayLeaderboard from '@/components/parlayLeaderboard/ParlayLeaderboard'
import { PAGES } from '@/utils/enums'
import { useIsMounted } from '@/hooks/useIsMounted'
import Stats from '@/components/stats/Stats'

interface ILayout {
	children: ReactNode
}

const Content: FC<ILayout> = ({ children }) => {
	const router = useRouter()
	const { id } = router.query
	const fullWidthPages = [`/${PAGES.PARLAY_SUPERSTARS}`, `/${PAGES.LEADERBOARD}`]
	const { chain } = useNetwork()
	const isMounted = useIsMounted()

	return (
		<SC.MainContainer>
			{/* // Dashboard's stats */}
			{chain?.id && isMounted && <Stats />}
			{/* // Full width pages (lists) */}
			{includes(fullWidthPages, router.pathname) && !id ? (
				<SC.FullWidthContentCol lg={24} xl={24}>
					{children}
				</SC.FullWidthContentCol>
			) : (
				// Pages with BetContainer
				<Row gutter={[30, 30]} style={{ display: 'flex', justifyContent: 'space-between' }}>
					<SC.MainContentContainer>{children}</SC.MainContentContainer>
					{/* // Dashboard's Parlay Leaderboard */}
					<SC.MobileHiddenCol span={8}>
						{router.pathname === `/${PAGES.DASHBOARD}` && <ParlayLeaderboard />}
						<TicketBetContainer />
					</SC.MobileHiddenCol>
				</Row>
			)}
		</SC.MainContainer>
	)
}

export default Content
