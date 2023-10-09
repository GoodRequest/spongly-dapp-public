import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { Col } from 'antd'
import { useRouter } from 'next-translate-routes'
import { useNetwork } from 'wagmi'

// components
import HeaderLogo from '@/components/headerLogo/HeaderLogo'
import ConnectButton from '@/components/connectButton/ConnectButton'
import MobileMenu from '@/components/mobileMenu/MobileMenu'

// utils
import { PAGES } from '@/utils/enums'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

// styled
import * as SC from './HeaderStyles'

const Header = () => {
	const [selected, setSelected] = useState(PAGES.DASHBOARD)
	const { t } = useTranslation()
	const router = useRouter()
	const { chain } = useNetwork()
	const isMounted = useIsMounted()

	const handleSelect = (e: any) => {
		router.push(`/${e.key}`)
	}

	const menuItems = useMemo(
		() => (
			<>
				<SC.MenuItem key={PAGES.DASHBOARD}>{t('Dashboard')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.TICKETS}>{t('Tickets')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.LEADERBOARD}>{t('Leaderboard')}</SC.MenuItem>
				<SC.MenuItem key={PAGES.MATCHES}>{t('Matches')}</SC.MenuItem>
				{isMounted && chain?.id && <SC.MenuItem key={PAGES.MY_WALLET}>{t('My wallet')}</SC.MenuItem>}
				<SC.MenuItem key={PAGES.PARLAY_SUPERSTARS}>{t('Parlay Superstars')}</SC.MenuItem>
			</>
		),
		[t, isMounted, chain?.id]
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
			<SC.XXLWrapper>
				<SC.HeadRow align={'middle'} justify={'space-between'}>
					<Col flex={'80px'}>
						<HeaderLogo />
					</Col>
					<Col flex={'auto'}>
						<SC.Menu disabledOverflow={true} mode={'horizontal'} onClick={handleSelect} selectedKeys={[selected]}>
							{menuItems}
						</SC.Menu>
					</Col>
					<Col flex={'240px'}>
						<ConnectButton />
					</Col>
				</SC.HeadRow>
			</SC.XXLWrapper>
			<SC.XLWrapper>
				<SC.HeadRow align={'middle'} justify={'space-between'}>
					<Col flex={'80px'}>
						<HeaderLogo />
					</Col>
					{/* <Col flex={'300px'}> */}
					<Col flex={'240px'}>
						<SC.WalletDiv>
							<div style={{ width: '240px' }}>
								<ConnectButton />
							</div>
							{/* <Settings /> */}
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
