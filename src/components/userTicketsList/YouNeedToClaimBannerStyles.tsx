import styled from 'styled-components'
import { HeadingSMMedium, TextMDRegular } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'
import bannerbackground from '../../assets/images/ClaimBannerBackground.png'

export const ContentWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 26px 32px 26px 32px;
	border-radius: 12px;
	background: url(${bannerbackground}) no-repeat;
	background-size: cover;
	margin-bottom: 32px;

	@media (max-width: ${breakpoints.md}px) {
		background: radial-gradient(farthest-corner at bottom left, rgba(108, 120, 237, 0.7), transparent 450px);
	}
`

export const ClaimHeader = styled.div`
	display: flex;
	flex-direction: row;
`

export const ClaimText = styled.span`
	${TextMDRegular}
`

export const YouNeedTo = styled.span`
	${HeadingSMMedium}
`

export const Claim = styled.span`
	${HeadingSMMedium};
	margin-left: 8px;
	color: ${({ theme }) => theme['color-base-state-success-fg']}};
`
