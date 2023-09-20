import { FC, ReactNode } from 'react'
import { Col, Row } from 'antd'
import { useRouter } from 'next-translate-routes'
import { includes } from 'lodash'

import * as SC from './ContentStyles'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'
import ParlayLeaderboard from '@/components/parlayLeaderboard/ParlayLeaderboard'
import { PAGES, RESOLUTIONS } from '@/utils/enums'
import { useMedia } from '@/hooks/useMedia'

interface ILayout {
	children: ReactNode
}

const Content: FC<ILayout> = ({ children }) => {
	const router = useRouter()
	const size = useMedia()
	const fullWidthPages = [`/${PAGES.PARLAY_LEADERBOARD}`]

	return (
		<SC.MainContainer>
			<Row gutter={30} style={{ display: 'flex', justifyContent: 'space-between' }}>
				{includes(fullWidthPages, router.pathname) ? (
					<Col lg={24} xl={24}>
						{children}
					</Col>
				) : (
					<>
						<SC.MainContentContainer>{children}</SC.MainContentContainer>
						{includes([RESOLUTIONS.SEMIXXL, RESOLUTIONS.XXL], size) && (
							<SC.MobileHiddenCol span={8}>
								{router.pathname === `/${PAGES.DASHBOARD}` && <ParlayLeaderboard />}
								<TicketBetContainer />
							</SC.MobileHiddenCol>
						)}
					</>
				)}
			</Row>
		</SC.MainContainer>
	)
}

export default Content
