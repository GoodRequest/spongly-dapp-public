import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { includes } from 'lodash'
import LogoImg from '@/assets/icons/sponglyLogo.svg'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import Content from '../content/Content'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'

import useFetchTickets from '@/redux/tickets/ticketsHooks'
import { useFetchAllMatches } from '@/redux/matches/matchesHooks'
import { useMedia } from '@/hooks/useMedia'

import * as SC from './LayoutStyles'
import * as PSC from '../content/ContentStyles'
import { RESOLUTIONS } from '@/utils/enums'

interface ILayout {
	children: ReactNode
}

const Layout: FC<ILayout> = ({ children }) => {
	const { t } = useTranslation()
	const [initialization, setInitialization] = useState(true)
	const size = useMedia()

	useFetchTickets()
	useFetchAllMatches()

	useEffect(() => {
		setTimeout(() => {
			setInitialization(false)
		}, 1000)
	}, [])

	return (
		<SC.LayoutWrapper id={'modal-container'}>
			<PSC.MainContainer>
				<Header />
			</PSC.MainContainer>
			<PSC.MinWidthContainer>
				<Content>{children}</Content>
			</PSC.MinWidthContainer>
			{includes([RESOLUTIONS.SM, RESOLUTIONS.MD, RESOLUTIONS.LG, RESOLUTIONS.XL], size) && (
				<SC.MobileTicketBetWrapper>
					<TicketBetContainer />
				</SC.MobileTicketBetWrapper>
			)}
			<Footer />
			{initialization && (
				<SC.OverlayLoading>
					<SC.Logo src={LogoImg} alt={'Spongly'} />
					<SC.LoadingWrapper>
						<SC.SpinnerWrapper>
							<Spin spinning={true} size={'large'} indicator={<LoadingOutlined spin />} />
						</SC.SpinnerWrapper>
						{`${t('Loading')}...`}
					</SC.LoadingWrapper>
				</SC.OverlayLoading>
			)}
		</SC.LayoutWrapper>
	)
}

export default Layout
