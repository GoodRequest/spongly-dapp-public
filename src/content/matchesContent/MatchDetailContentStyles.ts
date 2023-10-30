import styled, { css } from 'styled-components'
import { Col, Skeleton } from 'antd'
import { breakpoints } from '@/styles/theme'
import { HeadingXSMedium, TextXLMedium, TextXSMedium } from '@/styles/typography'
import { MATCH_STATUS } from '@/utils/constants'
import { MATCH_RESULT, TEAM_TYPE } from '@/utils/enums'
import { BasicBoxShadow, flicker } from '@/styles/GlobalStyles'

export const MatchDetailWrapper = styled.div`
	width: 100%;
	padding: 24px;
	position: relative;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	@media (max-width: ${breakpoints.md}px) {
		padding: 16px;
	}
`
export const MatchDetailHeader = styled.div`
	margin-bottom: 24px;
	@media (max-width: ${breakpoints.md}px) {
		margin-bottom: 0;
	}
`
export const HeaderTeam = styled.div`
	${HeadingXSMedium};
	text-align: center;
	height: 84px;
	@media (max-width: ${breakpoints.md}px) {
		${TextXSMedium};
		margin-top: 8px;
		height: auto;
	}
`
export const HeaderResultText = styled.div`
	margin: 16px 0;
	${HeadingXSMedium};
	text-align: center;
	@media (max-width: ${breakpoints.md}px) {
		${TextXLMedium};
		margin: 0;
	}
`

export const HeaderStatus = styled.div<{ matchStatus: MATCH_STATUS }>`
	${TextXSMedium};
	padding: 12px;
	text-align: center;
	position: relative;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border-radius: 6px;
	${(p) =>
		p.matchStatus === MATCH_STATUS.ONGOING &&
		css`
			position: relative;
			background: ${({ theme }) => theme['color-base-state-warning-bg']};
			color: ${({ theme }) => theme['color-base-state-warning-fg']};
			& > span {
				position: relative;
				&::before {
					content: '';
					position: absolute;
					left: -6px;
					top: 50%;
					transform: translate(-50%, -50%);
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: ${({ theme }) => theme['color-base-state-warning-fg']};
					animation: ${flicker} 1s infinite;
				}
			}
		`}
	${(p) =>
		p.matchStatus === MATCH_STATUS.CANCELED &&
		css`
			background: ${({ theme }) => theme['color-base-state-error-bg']};
			color: ${({ theme }) => theme['color-base-state-error-fg']};
		`}
	${(p) =>
		p.matchStatus === MATCH_STATUS.ONGOING &&
		css`
			color: ${({ theme }) => theme['color-base-state-warning-fg']};
		`};
	@media (max-width: ${breakpoints.md}px) {
		margin-top: 16px;
	}
`

export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 999px;
	padding: 16px;
	position: relative;
	@media (max-width: ${breakpoints.md}px) {
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		border-radius: 999px;
		border: 2px solid ${({ theme }) => theme['color-base-surface-secondary']};
		height: 48px;
		width: 48px;
	}
	&:last-of-type {
		margin-left: -14px;
	}
	&:first-of-type {
		margin-left: 0;
	}
	img {
		padding: 12px;
		width: 120px;
		height: 120px;
		@media (max-width: ${breakpoints.md}px) {
			height: 48px;
			width: 48px;
		}
	}
`

export const HeaderCol = styled(Col)<{ result?: MATCH_RESULT; team?: TEAM_TYPE }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 16px;
	${(p) =>
		p.team &&
		css`
			border: 1px solid ${({ theme }) => theme['color-base-surface-quintarny']};
			background: ${({ theme }) => theme['color-base-surface-primary']};
			border-radius: 12px;
		`};
	// Home win
	${(p) =>
		p.result === MATCH_RESULT.HOME &&
		p.team === TEAM_TYPE.HOME_TEAM &&
		css`
			border: 1px solid ${({ theme }) => theme['color-base-surface-quintarny']};
			background: ${({ theme }) => theme['color-base-surface-quintarny']};
			border-radius: 12px;
			${BasicBoxShadow};
		`};
	// Away win
	${(p) =>
		p.result === MATCH_RESULT.AWAY &&
		p.team === TEAM_TYPE.AWAY_TEAM &&
		css`
			border: 1px solid ${({ theme }) => theme['color-base-surface-quintarny']};
			background: ${({ theme }) => theme['color-base-surface-quintarny']};
			${BasicBoxShadow};
			border-radius: 12px;
		`};
	// Draw
	${(p) =>
		p.result === MATCH_RESULT.DRAW &&
		css`
			border: 1px solid ${({ theme }) => theme['color-base-surface-quintarny']};
			background: ${({ theme }) => theme['color-base-surface-quintarny']};
			border-radius: 12px;
			${BasicBoxShadow};
		`};
`
export const RowSkeleton = styled(Skeleton)`
	.ant-skeleton-content {
		padding: 24px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		margin: 16px 0 16px 0;
		border-radius: 12px;
		h3,
		ul li {
			&::after {
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(0, 0, 0, 0.2) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
			}
		}
	}
`
export const Separator = styled.div`
	width: calc(100% + 32px);
	margin-left: -16px;
	border-bottom: 1.5px solid ${({ theme }) => theme['color-base-surface-quintarny']};
	margin-top: 24px;
	height: 1px;
	transform: rotate(0deg);
	margin-bottom: 24px;
`
