import styled from 'styled-components'
import { Button, Row, Col } from 'antd'
import { TextSMMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const MatchRow = styled(Row)<{ readOnly?: boolean }>`
	pointer-events: ${({ readOnly }) => (readOnly ? 'none' : 'auto')};
	position: relative;
	display: flex;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border-radius: 8px;
	padding: 8px;
	margin-bottom: 12px;
	justify-content: flex-start;
	align-items: center;
	line-height: 1rem;
	color: ${({ theme }) => theme['color-base-content-top']};
`

export const StartCenteredRow = styled(Row)`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

export const TeamImages = styled.div`
	height: 48px;
	margin-right: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
`

export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	background: ${({ theme }) => theme['color-base-surface-primary']};
	border: 2px solid ${({ theme }) => theme['color-base-surface-quaternary']};
	&:last-of-type {
		margin-left: -14px;
	}
	img {
		padding: 4px;
		max-width: 28px;
		max-height: 28px;
	}
`

export const TeamNames = styled.div`
	height: 48px;
	width: calc(100% - 90px);
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export const TeamName = styled.div`
	${TextSMMedium};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

export const BetOptionButton = styled(Button)`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	box-shadow: none;
	background: ${({ theme }) => theme['color-base-action-secondary-default']};
	border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']};
`

export const MatchOdd = styled.div`
	width: 32px;
	${TextSMMedium};
`

export const RemoveButtonWrapper = styled.div`
	position: absolute;
	top: 12px;
	right: 0px;
	@media (max-width: ${breakpoints.md}px) {
		top: 0px;
		right: 0px;
	}
`

export const MatchIcons = styled.div`
	height: 48px;
	width: 90px;
`

export const ShiftedRow = styled(Row)`
	margin-bottom: 24px;
`

export const MatchNames = styled.div`
	height: 48px;
	width: calc(100% - 90px);
`
export const BonusText = styled.div<{ hide?: boolean }>`
	${TextXSMedium};
	width: ${({ hide }) => (hide ? '28px' : 'auto')};
	margin-left: ${({ hide }) => (hide ? '0' : '4px')};
	visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
	color: ${({ theme }) => theme['color-base-state-success-fg']};
`

export const OddCol = styled(Col)`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`
