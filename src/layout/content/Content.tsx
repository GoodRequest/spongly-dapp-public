import React, { FC, ReactNode } from 'react'
import { useRouter } from 'next-translate-routes'
import { includes } from 'lodash'
import { useNetwork } from 'wagmi'

// components
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import ParlayLeaderboard from '@/components/parlayLeaderboard/ParlayLeaderboard'
import Stats from '@/components/stats/Stats'

// utils
import { PAGES } from '@/utils/enums'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

// styles
import * as SC from './ContentStyles'
import UserStatisticRow from '@/components/statisticRow/UserStatisticRow'

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
			{isMounted && (
				<>
					<UserStatisticRow />
					<Stats />
				</>
			)}
			{/* // Full width pages (lists) */}
			{includes(fullWidthPages, router.pathname) && !id ? (
				<SC.FullWidthContentCol lg={24} xl={24}>
					{children}
				</SC.FullWidthContentCol>
			) : (
				// Pages with BetContainer
				<SC.ContentWithBetContainerRow gutter={[30, 30]}>
					<SC.MainContentContainer>{children}</SC.MainContentContainer>
					{/* // Dashboard's Parlay Leaderboard */}
					<SC.MobileHiddenCol span={8}>
						{router.pathname === `/${PAGES.DASHBOARD}` && <ParlayLeaderboard />}
						<TicketBetContainer />
					</SC.MobileHiddenCol>
				</SC.ContentWithBetContainerRow>
			)}
		</SC.MainContainer>
	)
}

export default Content
