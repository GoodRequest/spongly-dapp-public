import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import LogoImg from '@/assets/icons/sponglyLogo.svg'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import Content from '../content/Content'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'

import useFetchTickets from '@/redux/tickets/ticketsHooks'
import { useFetchAllMatches } from '@/redux/matches/matchesHooks'

import * as SC from './LayoutStyles'
import * as PSC from '../content/ContentStyles'

interface ILayout {
	children: ReactNode
}

const Layout: FC<ILayout> = ({ children }) => {
	const { t } = useTranslation()
	const [initialization, setInitialization] = useState(true)

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
			<SC.MobileTicketBetWrapper>
				<TicketBetContainer />
			</SC.MobileTicketBetWrapper>
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
