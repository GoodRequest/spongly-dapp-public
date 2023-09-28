import styled from 'styled-components'
import { Button, Col, Row, Skeleton as AntdSkeleton } from 'antd'
import { TextMDMedium, TextXLMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardWrapper = styled.div`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	padding-top: 24px;
	padding-bottom: 20px;
	padding-left: 24px;
	padding-right: 24px;
	margin-bottom: 40px;

	@media (max-width: ${breakpoints.semixxl}px) {
		display: none;
	}
`

export const ParlayLeaderboardRow = styled(Row)`
	margin-bottom: 20px;
`
export const CenterRowContent = styled(Col)`
	display: flex;
	justify-content: center;
`

export const LeaderboardButton = styled(Button)`
	margin-top: 16px;
	height: 48px;
	background: ${({ theme }) => theme['color-base-action-primary-default']};
	border-radius: 12px;
	width: 100%;
	box-shadow: none;
	${TextMDMedium}

	:hover {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-action-primary-hover']} !important;
	}
`

export const Skeleton = styled(AntdSkeleton)`
	margin-top: 16px;
	margin-bottom: 16px;
`

export const ParlayLeaderboardHeader = styled.span`
	${TextXLMedium}
`

export const ParlayLeaderboardTableTitle = styled.span`
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
