import styled, { css, keyframes } from 'styled-components'
import { Col, Skeleton } from 'antd'
import { breakpoints } from '@/styles/theme'
import { HeadingXSMedium, TextMDSemibold, TextXSMedium } from '@/styles/typography'
import { MATCH_STATUS } from '@/utils/constants'
import { MATCH_RESULT, TEAM_TYPE } from '@/utils/enums'

export const MatchDetailWrapper = styled.div`
	width: 100%;
	margin: 40px 15px 15px 15px;
	padding: 24px;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`
export const MatchDetailHeader = styled.div`
	margin-bottom: 30px;
`
export const HeaderTeam = styled.div`
	margin-top: 16px;
	${HeadingXSMedium};
	text-align: center;
	height: 84px;
	@media (max-width: ${breakpoints.md}px) {
		${TextMDSemibold};
		margin-top: 8px;
		height: 48px;
	}
`
export const HeaderVersusText = styled.div`
	${HeadingXSMedium};
	text-align: center;
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	@media (max-width: ${breakpoints.md}px) {
		${TextMDSemibold};
		color: ${({ theme }) => theme['color-base-content-quaternary']};
	}
`
const flicker = keyframes`
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
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
					left: -10px;
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
		margin-bottom: 16px;
	}
`

export const MatchIcon = styled.div<{ result?: MATCH_RESULT; team: TEAM_TYPE }>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 999px;
	// TODO: Uncomment when designer add styles for thsoe states
	// background: ${({ theme }) => theme['color-base-surface-quaternary']};
	//border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']};
	padding: 16px;
	position: relative;
	/* TODO: Uncomment when designer add styles for thsoe states
	${(p) =>
		p.result === MATCH_RESULT.DRAW &&
		css`
			background: ${({ theme }) => theme['color-base-state-warning-bg']};
			border: 2px solid ${({ theme }) => theme['color-base-state-warning-fg']};
		`};
	${(p) =>
		p.result === MATCH_RESULT.HOME &&
		p.team === TEAM_TYPE.HOME_TEAM &&
		css`
			background: ${({ theme }) => theme['color-base-state-success-bg']};
			border: 2px solid ${({ theme }) => theme['color-base-state-success-fg']};
			&::before {
				content: '\\2713';
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20px;
				position: absolute;
				top: 12px;
				right: 0;
				height: 32px;
				width: 32px;
				background: ${({ theme }) => theme['color-base-state-success-fg']};
				border-radius: 50%;
			}
		`};
	${(p) =>
		p.result === MATCH_RESULT.AWAY &&
		p.team === TEAM_TYPE.AWAY_TEAM &&
		css`
			background: ${({ theme }) => theme['color-base-state-success-bg']};
			border: 2px solid ${({ theme }) => theme['color-base-state-success-fg']};
			&::before {
				content: '\\2713';
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20px;
				position: absolute;
				top: 12px;
				right: 0;
				height: 32px;
				width: 32px;
				background: ${({ theme }) => theme['color-base-state-success-fg']};
				border-radius: 50%;
			}
		`};
	*/
	@media (max-width: ${breakpoints.md}px) {
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		border-radius: 999px;
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

export const HeaderCol = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	@media (max-width: ${breakpoints.md}px) {
		justify-content: flex-start;
	}
`
export const FlagWrapper = styled.div`
	width: 80px;
	@media (max-width: ${breakpoints.md}px) {
		width: 40px;
	}
`
export const RowSkeleton = styled(Skeleton)`
	margin-top: 40px;
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
