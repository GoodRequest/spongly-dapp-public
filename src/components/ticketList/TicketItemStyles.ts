import styled, { css, keyframes } from 'styled-components'
import { Col } from 'antd'
import { TextSMMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'
import { FlexItemCenter } from '@/styles/GlobalStyles'
import { MATCH_STATUS } from '@/utils/constants'

export const TicketItemWrapper = styled.div`
	height: 100%;
	border-radius: 8px;
	padding: 12px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	&:hover {
		cursor: pointer;
		outline: 1px solid ${({ theme }) => theme['color-base-action-primary-default']};
	}
	&:last-of-type {
		margin-right: 0; /* Remove right margin for the last item */
	}
	@media (max-width: ${breakpoints.md}px) {
		width: 100%;
	}
`

export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	height: 48px;
	width: 48px;
	border-radius: 50%;
	background: ${({ theme }) => theme['color-base-surface-primary']};
	border: 2px solid ${({ theme }) => theme['color-base-surface-quaternary']};
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
		max-width: 28px;
		max-height: 28px;
	}
`
export const ResultsWrapper = styled(Col)`
	display: flex;
	margin-left: -16px;
	white-space: nowrap;
	align-items: center;
	${TextSMMedium};
	margin-top: 14px;
	justify-content: right;
`

export const OddsWrapper = styled(Col)`
	display: flex;
	align-items: center;
	justify-content: end;
	margin-top: 8px;
	@media (max-width: ${breakpoints.sm}px) {
		justify-content: start;
	}
`
export const TicketHeader = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 12px;
`
const flicker = keyframes`
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
`
export const TicketStatus = styled.div<{ matchStatus: MATCH_STATUS }>`
	${TextSMMedium};
	display: flex;
	justify-content: center;
	align-items: center;
	padding-top: 6px;
	padding-bottom: 6px;
	height: 48px;
	width: 100%;
	text-transform: uppercase;
	border-radius: 6px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	color: ${({ theme }) => theme['color-base-content-tertiary']};

	${(p) =>
		p.matchStatus === MATCH_STATUS.ONGOING &&
		css`
			position: relative;
			color: ${({ theme }) => theme['color-base-state-warning-fg']};
			background: ${({ theme }) => theme['color-base-state-warning-bg']};
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
		p.matchStatus === MATCH_STATUS.SUCCESS &&
		css`
			background: ${({ theme }) => theme['color-base-state-success-bg']};
			color: ${({ theme }) => theme['color-base-state-success-fg']};
		`}
	${(p) =>
		p.matchStatus === MATCH_STATUS.MISS &&
		css`
			background: ${({ theme }) => theme['color-base-state-error-bg']};
			color: ${({ theme }) => theme['color-base-state-error-fg']};
		`}
	${(p) =>
		p.matchStatus === MATCH_STATUS.CANCELED &&
		css`
			background: ${({ theme }) => theme['color-base-state-error-bg']};
			color: ${({ theme }) => theme['color-base-state-error-fg']};
		`}
`

export const SportLogo = styled.div`
	${FlexItemCenter};
	border-radius: 6px;
	margin-right: 8px;
	height: 32px;
	width: 32px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`

export const TeamText = styled.div`
	margin-right: 8px;
	${TextSMMedium}
`

export const BonusText = styled.div`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-state-success-fg']};
`

export const OddText = styled.div`
	margin-right: 4px;
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const BonusLabel = styled.span`
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-state-success-fg']};
	margin-left: 4px;
`
