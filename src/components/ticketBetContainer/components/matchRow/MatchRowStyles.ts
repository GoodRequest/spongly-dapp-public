import styled from 'styled-components'
import { Button, Row, Col } from 'antd'
import { TextXSMedium, TextXSRegular } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const RemoveButtonWrapper = styled.div`
	position: absolute;
	display: none;
	top: 0;
	right: 0;
	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

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
	&:hover {
		${RemoveButtonWrapper} {
			display: block;
		}
	}
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

export const TeamNames = styled.div`
	height: 48px;
	width: calc(100% - 90px);
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export const TeamName = styled.div`
	${TextXSRegular};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

export const BetOptionButton = styled(Button)`
	${TextXSRegular};
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	box-shadow: none;
	background: ${({ theme }) => theme['color-base-action-secondary-default']};
	border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']};
	&:disabled {
		color: ${({ theme }) => theme['color-base-content-top']};
		border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']};
		background: ${({ theme }) => theme['color-base-action-secondary-default']};
	}
`

export const MatchOdd = styled.div`
	width: 38px;
	text-align: end;
	${TextXSRegular};
`

export const MatchIcons = styled.div`
	height: 48px;
	width: 90px;
`

export const MatchNames = styled.div`
	height: 48px;
	width: calc(100% - 90px);
`
export const BonusText = styled.div<{ hide?: boolean }>`
	${TextXSMedium};
	width: ${({ hide }) => (hide ? '28px' : 'auto')};
	margin-left: ${({ hide }) => (hide ? '0' : '4px')};
	display: ${({ hide }) => (hide ? 'none' : 'block')};
	color: ${({ theme }) => theme['color-base-state-success-fg']};
`

export const OddCol = styled(Col)`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`
