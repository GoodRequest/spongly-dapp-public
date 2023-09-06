import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Row, Col } from 'antd'
import { useRouter } from 'next-translate-routes'
import { useAccount, useNetwork } from 'wagmi'

import Button from '@/atoms/button/Button'
import { PAGES } from '@/utils/enums'
import { formatAddress } from '@/utils/formatters/string'
import { useIsMounted } from '@/hooks/useIsMounted'

import OpenMenuIcon from '@/assets/icons/mobile-menu-icon.svg'
import CloseMenuIcon from '@/assets/icons/close-icon.svg'
import LogoImg from '@/assets/icons/header-logo-placeholder.svg'

import * as SC from './MobileMenuStyles'

type Props = {
	selected: string
}

const MobileMenu = ({ selected }: Props) => {
	const { t } = useTranslation()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const { address } = useAccount()
	const { chain } = useNetwork()

	const isMounted = useIsMounted()

	const handleSelect = (e: any) => {
		router.push(`/${e.key}`)
		setIsOpen(false)
	}

	return (
		<>
			<SC.MenuWrapper onClick={() => setIsOpen(!isOpen)}>
				<SC.MenuLogo src={isOpen ? CloseMenuIcon : OpenMenuIcon} />
			</SC.MenuWrapper>
			<SC.OverlayDiv isOpen={isOpen}>
				<SC.Wrapper isOpen={isOpen}>
					<SC.Menu mode={'vertical'} onClick={(e) => handleSelect(e)} selectedKeys={[selected]}>
						<SC.MenuItem key={PAGES.DASHBOARD}>{t('Dashboard')}</SC.MenuItem>
						<SC.MenuItem key={PAGES.TICKETS}>{t('Tickets')}</SC.MenuItem>
						<SC.MenuItem key={PAGES.MATCHES}>{t('Matches')}</SC.MenuItem>
						{isMounted && chain?.id && <SC.MenuItem key={PAGES.MY_WALLET}>{t('My wallet')}</SC.MenuItem>}
						<SC.MenuItem key={PAGES.PARLAY_LEADERBOARD}>{t('Parlay Leaderboard')}</SC.MenuItem>
					</SC.Menu>
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
							<Col span={12}>
								{/* <Button
									btnStyle={'secondary'}
									content={
										<SC.CenterDiv>
											<SC.MenuLogo src={SettingsIcon} />
											<span style={{ marginLeft: '8px' }}>{t('Settings')}</span>
										</SC.CenterDiv>
									}
								/> */}
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
													content={<span>{t('Connect Wallet')}</span>}
												/>
											)
										}

										return (
											<SC.DisconnectWrapper>
												<SC.AddressWrapper>
													<SC.LogoImg src={LogoImg} />
													{isMounted && <SC.AddressText>{formatAddress(address)}</SC.AddressText>}
												</SC.AddressWrapper>
												<Button
													btnStyle={'secondary'}
													onClick={() => openAccountModal()}
													content={<span>{t('Disconnect Wallet')}</span>}
												/>
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
