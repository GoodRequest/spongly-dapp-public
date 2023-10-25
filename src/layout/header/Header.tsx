import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Col } from 'antd'
import { useRouter } from 'next-translate-routes'

// components
import HeaderLogo from '@/components/headerLogo/HeaderLogo'
import ConnectButton from '@/components/connectButton/ConnectButton'
import MobileMenu from '@/components/mobileMenu/MobileMenu'
import SettingsIcon from '@/assets/icons/settings-icon.svg'
import SettingsModal from '@/components/settingsModal/SettingsModal'

// utils
import { PAGES } from '@/utils/enums'

// styled
import * as SC from './HeaderStyles'

const Header = () => {
	const [selected, setSelected] = useState(PAGES.DASHBOARD)
	const { t } = useTranslation()
	const router = useRouter()
	const [visibleSettingModal, setVisibleSettingModal] = useState(false)
	const handleSelect = (e: any) => {
		router.push(`/${e.key}`)
	}

	const modals = <SettingsModal visible={visibleSettingModal} setVisible={setVisibleSettingModal} />
	const menuItems = useMemo(
		() => (
			<>
				<SC.MenuItem key={PAGES.DASHBOARD}>{t('Dashboard')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.TICKETS}>{t('Tickets')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.MATCHES}>{t('Matches')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.LEADERBOARD}>{t('Leaderboard')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.PARLAY_SUPERSTARS}>{t('Parlay Superstars')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.MY_WALLET}>{t('My wallet')}</SC.MenuItem>
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	const chooseSelected = () => {
		switch (router.pathname) {
			case `/${PAGES.DASHBOARD}`:
				setSelected(PAGES.DASHBOARD)
				break
			case `/${PAGES.TICKETS}`:
				setSelected(PAGES.TICKETS)
				break
			case `/${PAGES.MATCHES}`:
				setSelected(PAGES.MATCHES)
				break
			case `/${PAGES.MATCH_DETAIL}`:
				setSelected(PAGES.MATCHES)
				break
			case `/${PAGES.PARLAY_SUPERSTARS}`:
				setSelected(PAGES.PARLAY_SUPERSTARS)
				break
			case `/${PAGES.MY_WALLET}`:
				setSelected(PAGES.MY_WALLET)
				break
			case `/${PAGES.LEADERBOARD}`:
				setSelected(PAGES.LEADERBOARD)
				break
			default:
				setSelected(PAGES.DASHBOARD)
				break
		}
	}

	useEffect(() => {
		chooseSelected()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname])

	return (
		<>
			{modals}
			<SC.XXLWrapper>
				<SC.HeadRow align={'middle'} justify={'space-between'} gutter={16}>
					<Col flex={'80px'}>
						<HeaderLogo />
					</Col>
					<Col flex={'auto'}>
						<SC.Menu disabledOverflow={true} mode={'horizontal'} onClick={handleSelect} selectedKeys={[selected]}>
							{menuItems}
						</SC.Menu>
					</Col>
					<Col flex={'292px'}>
						<SC.WalletDiv>
							<div style={{ width: '240px' }}>
								<ConnectButton />
							</div>
							<SC.SettingButton onClick={() => setVisibleSettingModal(true)}>
								<img src={SettingsIcon} alt='settings' />
							</SC.SettingButton>
						</SC.WalletDiv>
					</Col>
				</SC.HeadRow>
			</SC.XXLWrapper>
			<SC.XLWrapper>
				<SC.HeadRow align={'middle'} justify={'space-between'}>
					<Col flex={'80px'}>
						<HeaderLogo />
					</Col>
					<Col flex={'292px'}>
						<SC.WalletDiv>
							<div style={{ width: '240px' }}>
								<ConnectButton />
							</div>
							<SC.SettingButton onClick={() => setVisibleSettingModal(true)}>
								<img src={SettingsIcon} alt='settings' />
							</SC.SettingButton>
						</SC.WalletDiv>
					</Col>
				</SC.HeadRow>
				<SC.Divider />
				<SC.MenuXLRow>
					<SC.Menu disabledOverflow={true} mode={'horizontal'} onClick={handleSelect} selectedKeys={[selected]}>
						{menuItems}
					</SC.Menu>
				</SC.MenuXLRow>
			</SC.XLWrapper>
			<SC.MobileWrapper>
				<SC.HeadRow align={'middle'} justify={'space-between'}>
					<Col flex={'80px'}>
						<HeaderLogo />
					</Col>
					<Col>
						<SC.WalletDiv>
							<ConnectButton />
						</SC.WalletDiv>
					</Col>
				</SC.HeadRow>
				<MobileMenu selected={selected} />
			</SC.MobileWrapper>
		</>
	)
}

export default Header
