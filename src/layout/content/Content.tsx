import React, { FC, ReactNode } from 'react'
import { Col, Row } from 'antd'
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
			{chain?.id && isMounted && <Stats />}
			<Row gutter={[30, 30]} style={{ display: 'flex', justifyContent: 'space-between' }}>
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
