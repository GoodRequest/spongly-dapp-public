import { useTranslation } from 'next-export-i18n'
import * as SC from './YouNeedToClaimBannerStyles'

const YouNeedToClaimBanner = () => {
	const { t } = useTranslation()

	return (
		<SC.ContentWrapper>
			<SC.ClaimHeader>
				<SC.YouNeedTo>
					{t('You need to')}
					<SC.Claim>{t('claim')}</SC.Claim>
				</SC.YouNeedTo>
			</SC.ClaimHeader>
			<SC.ClaimText>{t('Tickets not redeemed within 30 days of market being resolved are forfeit.')}</SC.ClaimText>
		</SC.ContentWrapper>
	)
}

export default YouNeedToClaimBanner
