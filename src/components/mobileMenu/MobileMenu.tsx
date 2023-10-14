import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useRouter } from 'next-translate-routes'
import { useAccount } from 'wagmi'

import Button from '@/atoms/button/Button'
import { PAGES } from '@/utils/enums'
import { formatAddress } from '@/utils/formatters/string'
import { useIsMounted } from '@/hooks/useIsMounted'

import OpenMenuIcon from '@/assets/icons/mobile-menu-icon.svg'
import CloseMenuIcon from '@/assets/icons/close-icon.svg'
import LogoImg from '@/assets/icons/header-logo-placeholder.svg'

import * as SC from './MobileMenuStyles'
import { SOCIAL_LINKS } from '@/utils/constants'
import TwitterIcon from '@/assets/icons/twitter.svg'
import DiscordIcon from '@/assets/icons/discord.svg'
import SettingsIcon from '@/assets/icons/settings-icon.svg'

type Props = {
	selected: string
}

const MobileMenu = ({ selected }: Props) => {
	const { t } = useTranslation()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const { address } = useAccount()

	const isMounted = useIsMounted()

	const handleSelect = (e: any) => {
		router.push(`/${e.key}`)
		setIsOpen(false)
	}

	const style = `
		<style>
			body {
				overflow: hidden;
	         }
		</style>
	`

	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			{isOpen && <div dangerouslySetInnerHTML={{ __html: style }} />}
			<SC.MenuWrapper onClick={() => setIsOpen(!isOpen)}>
				<SC.MenuLogo src={isOpen ? CloseMenuIcon : OpenMenuIcon} />
			</SC.MenuWrapper>
			<SC.OverlayDiv isOpen={isOpen}>
				<SC.Wrapper isOpen={isOpen}>
					<div>
						<SC.Menu mode={'vertical'} onClick={(e) => handleSelect(e)} selectedKeys={[selected]}>
							<SC.MenuItem key={PAGES.DASHBOARD}>{t('Dashboard')}</SC.MenuItem>
							<SC.MenuItem key={PAGES.TICKETS}>{t('Tickets')}</SC.MenuItem>
							<SC.MenuItem key={PAGES.MATCHES}>{t('Matches')}</SC.MenuItem>
							<SC.MenuItem key={PAGES.LEADERBOARD}>{t('Leaderboard')}</SC.MenuItem>
							<SC.MenuItem key={PAGES.PARLAY_SUPERSTARS}>{t('Parlay Superstars')}</SC.MenuItem>
							<SC.MenuItem key={PAGES.MY_WALLET}>{t('My wallet')}</SC.MenuItem>
						</SC.Menu>

						<SC.ButtonWrapper>
							<SC.SocialMediaButton href={SOCIAL_LINKS.TWITTER} target={'_blank'}>
								<img src={TwitterIcon} alt='twitter' />
							</SC.SocialMediaButton>
							<SC.SocialMediaButton href={SOCIAL_LINKS.DISCORD} target={'_blank'}>
								<img src={DiscordIcon} alt='discord' />
							</SC.SocialMediaButton>
						</SC.ButtonWrapper>
					</div>
					<div>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								{/* // TODO: implements when Settings / Swap will be added */}
								{/* <Button
									btnStyle={'secondary'}
									content={
										<SC.CenterDiv>
											<SC.MenuLogo src={SwapIcon} />
											<span style={{ marginLeft: '8px' }}>{t('Swap')}</span>
										</SC.CenterDiv>
									}
								/> */}
							</Col>
							<Col span={24}>
								<Button
									btnStyle={'secondary'}
									content={
										<SC.CenterDiv>
											<SC.MenuLogo src={SettingsIcon} />
											<span style={{ marginLeft: '8px' }}>{t('Settings')}</span>
										</SC.CenterDiv>
									}
								/>
							</Col>
							<Col span={24}>
								<RainbowConnectButton.Custom>
									{({ account, chain, openAccountModal, openConnectModal, mounted }) => {
										const connected = mounted && account && chain

										if (!connected) {
											return (
												<Button
													btnStyle={'primary'}
													style={{ marginBottom: '16px' }}
													onClick={() => openConnectModal()}
													content={t('Connect Wallet')}
												/>
											)
										}

										return (
											<SC.DisconnectWrapper>
												<SC.AddressWrapper>
													<SC.LogoImg src={LogoImg} />
													{isMounted && <SC.AddressText>{formatAddress(address)}</SC.AddressText>}
												</SC.AddressWrapper>
												<Button btnStyle={'secondary'} onClick={() => openAccountModal()} content={t('Disconnect Wallet')} />
											</SC.DisconnectWrapper>
										)
									}}
								</RainbowConnectButton.Custom>
							</Col>
						</Row>
					</div>
				</SC.Wrapper>
			</SC.OverlayDiv>
		</>
	)
}

export default MobileMenu
