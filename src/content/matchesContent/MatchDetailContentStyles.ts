import styled from 'styled-components'
import { Col } from 'antd'
import { breakpoints } from '@/styles/theme'
import { HeadingXSMedium } from '@/styles/typography'

export const MatchDetailWrapper = styled.div`
	width: 100%;
	margin-top: 40px;
	padding: 24px;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`
export const MatchDetailHeader = styled.div`
	margin-bottom: 30px;
`
export const HeaderTeam = styled.div`
	${HeadingXSMedium};
`
export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	height: 108px;
	width: 108px;
	@media (max-width: ${breakpoints.md}px) {
		height: 40px;
		width: 40px;
	}
	&:last-of-type {
		margin-left: -14px;
	}
	&:first-of-type {
		margin-left: 0;
	}
	img {
		padding: 4px;
		max-width: 80px;
		max-height: 80px;
	}
`

export const HeaderCol = styled(Col)`
	display: flex;
	flex-direction: column;
	align-items: center;
`
