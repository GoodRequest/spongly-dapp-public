// NOTE: Disable eslint for hidden sentry test
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useTranslation } from 'next-export-i18n'
import dayjs from 'dayjs'
import Image from 'next/image'
import LogoImg from '@/assets/icons/sponglyLogo.svg'
import DiscordIcon from '@/assets/icons/discord.svg'
import TwitterIcon from '@/assets/icons/twitter.svg'
import packageInfo from '../../../package.json'

import * as SC from './FooterStyles'
import { MSG_TYPE, NOTIFICATION_TYPE, SOCIAL_LINKS } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'

const Footer = () => {
	const { t } = useTranslation()

	let clicks = { start: null as any, times: 0 }

	const handleThrowError = () => {
		const now = dayjs()

		if (clicks.start && now.diff(clicks.start, 'seconds') < 3) {
			clicks = { start: clicks.start, times: clicks.times + 1 }
		} else {
			clicks = { start: dayjs(), times: 1 }
		}

		if (clicks.times > 10) {
			showNotifications([{ type: MSG_TYPE.INFO, message: t('Sentry test executed') }], NOTIFICATION_TYPE.NOTIFICATION)
			clicks = { start: null, times: 0 }
			throw new Error('Test sentry - NEXT-WEB')
		}
	}

	return (
		<SC.Footer>
			<SC.FooterHead>
				<Image src={LogoImg} alt={'Spongly logo'} />
				<SC.CopyrightDesktop>
					{'© All rights reserved'}
					<span onClick={handleThrowError} onKeyUp={handleThrowError} aria-hidden='true'>{`v ${packageInfo.version}`}</span>
				</SC.CopyrightDesktop>
				<SC.ButtonWrapper>
					<SC.FooterLinkButton href={SOCIAL_LINKS.TWITTER} target={'_blank'}>
						<img src={TwitterIcon} alt='twitter' />
					</SC.FooterLinkButton>
					<SC.FooterLinkButton href={SOCIAL_LINKS.DISCORD} target={'_blank'}>
						<img src={DiscordIcon} alt='discord' />
					</SC.FooterLinkButton>
				</SC.ButtonWrapper>
			</SC.FooterHead>
			<SC.CopyrightMobile>
				{`© All rights reserved`}
				&nbsp;
				{`v.${packageInfo.version}`}
			</SC.CopyrightMobile>
			<SC.FooterDivider />
			<SC.FooterContent>
				{t('footerTerms')}
				<SC.TermsLink href={SOCIAL_LINKS.TERMS} target={'_blank'}>
					{t('footerTermsLink')}
				</SC.TermsLink>
				{t('footerTerms2')}
			</SC.FooterContent>
		</SC.Footer>
	)
}

export default Footer
