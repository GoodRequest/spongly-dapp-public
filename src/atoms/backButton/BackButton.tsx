import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'

import * as SC from './BackButtonStyles'

type Props = {
	backUrl: string
}

const BackButton = ({ backUrl }: Props) => {
	const { t } = useTranslation()
	const router = useRouter()

	return (
		<SC.BackButtonWrapper onClick={() => router.push(backUrl)}>
			<SC.BackButton icon={<SC.BackButtonIcon />} />
			<SC.BackButtonText>{t('Back')}</SC.BackButtonText>
		</SC.BackButtonWrapper>
	)
}

export default BackButton
