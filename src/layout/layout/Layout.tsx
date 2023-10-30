import React, { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Input, Space, Spin } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from '@ant-design/icons'
import { useRouter } from 'next-translate-routes'

import { includes } from 'lodash'
import LogoImg from '@/assets/icons/sponglyLogo.svg'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import Content from '../content/Content'
import TicketBetContainer from '@/components/ticketBetContainer/TicketBetContainer'

import useFetchTickets from '@/redux/tickets/ticketsHooks'
import { useFetchAllMatches } from '@/redux/matches/matchesHooks'

import * as SC from './LayoutStyles'
import * as PSC from '../content/ContentStyles'
import { PAGES, WALLET_TICKETS } from '@/utils/enums'
import * as SCS from '@/layout/layout/LayoutStyles'
import Button from '@/atoms/button/Button'

interface ILayout {
	children: ReactNode
}

const Layout: FC<ILayout> = ({ children }) => {
	const { t } = useTranslation()
	const [initialization, setInitialization] = useState(true)
	const router = useRouter()
	const pagesWithoutStatusOverlay = [`/${PAGES.PARLAY_SUPERSTARS}`, `/${PAGES.LEADERBOARD}`]
	const [footerHeight, setFooterHeight] = useState(0)
	const [showOverlay, setShowOverlay] = useState(process.env.PASSWORD_VALIDATION === 'true')
	const [password, setPassword] = useState('')

	const validPassword = process.env.DEV_PASSWORD

	const handlePassword = (value: string) => {
		if (value === validPassword) {
			setShowOverlay(false)
		}
	}

	useFetchTickets()
	useFetchAllMatches()

	useEffect(() => {
		setTimeout(() => {
			setInitialization(false)
		}, 1000)
	}, [])

	useEffect(() => {
		function updateFooterHeight() {
			const footerContent = document.getElementById('footer-content')
			if (footerContent) {
				const height = footerContent.clientHeight
				setFooterHeight(height)
			}
		}

		// Update on mount
		updateFooterHeight()

		// Update when the screen is resized
		window.addEventListener('resize', updateFooterHeight)

		return () => {
			// Remove the event listener when the component unmounts
			window.removeEventListener('resize', updateFooterHeight)
		}
	}, [])

	return (
		<SC.LayoutWrapper id={'modal-container'}>
			<PSC.Status visible={!includes(pagesWithoutStatusOverlay, router.pathname)} status={router.query.status as WALLET_TICKETS} />
			<PSC.MainContainer>
				<Header />
			</PSC.MainContainer>
			<PSC.MinWidthContainer footerHeight={footerHeight}>
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
			{showOverlay && (
				<SC.LoadingOverlay show={showOverlay}>
					<SCS.Logo src={LogoImg} alt={'Spongly'} />
					<Space>
						<SC.StyledInput>
							<Input.Password
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={t('Input password')}
								iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							/>
						</SC.StyledInput>
						<br />
						<Button btnStyle={'primary'} size={'middle'} content={<span>{t('Authorize')}</span>} onClick={() => handlePassword(password)} />
					</Space>
					<div style={{ display: 'none' }}>{children}</div>
				</SC.LoadingOverlay>
			)}
		</SC.LayoutWrapper>
	)
}

export default Layout
