import React from 'react'
import { useTranslation } from 'next-export-i18n'

import { useRouter } from 'next-translate-routes'
import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import Button from '@/atoms/button/Button'
import * as SCS from '@/styles/GlobalStyles'
import { PAGES } from '@/utils/enums'

const Custom404 = () => {
	const { t } = useTranslation()
	const router = useRouter()
	return (
		// TODO: add styles from Figma
		<SCS.Empty
			image={EmptyStateImage}
			description={
				<div>
					<p>404</p>
					<span>{t('This page could not be find.')}</span>
					<Button style={{ marginTop: 16 }} btnStyle={'primary'} onClick={() => router.push(`${PAGES.DASHBOARD}`)} content={t('Go to dashboard')} />
				</div>
			}
		/>
	)
}

export default Custom404
