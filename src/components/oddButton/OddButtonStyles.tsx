import styled from 'styled-components'
import { Button } from 'antd'
import { TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const OddButton = styled(Button)<{ active?: boolean; isMobilePanel?: boolean; isHeader?: boolean }>`
	width: 62px;
	height: 32px;
	border-radius: 6px;
	border: 2px solid ${({ theme, active }) => (active ? theme['color-base-action-primary-default'] : theme['color-base-surface-quaternary'])} !important;
	box-shadow: none;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	${TextXSMedium};
	flex: 1;
	background: ${({ theme, active, isMobilePanel, isHeader }) => {
		if (isHeader && !active) {
			return theme['color-base-surface-quaternary']
		}
		if (isMobilePanel && !active) {
			return theme['color-base-surface-secondary'] // Inactive, Mobile Panel
		}
		if (!isMobilePanel && !isHeader) {
			return theme['color-base-surface-secondary']
		}
		if (active) {
			if (isHeader) {
				return theme['color-base-surface-secondary']
			}
			return theme['color-base-state-info-bg'] // Active, Desktop Panel
		}
		return theme['color-base-surface-quaternary'] // Inactive, Desktop Panel
	}};
	border-inline-start: 2px solid ${({ theme }) => theme['color-base-surface-quaternary']};
	label {
		&:hover {
			color: white;
		}
	}
	&:hover {
		border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']} !important;
		color: white !important;
	}
	&:disabled {
		background: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		color: white !important;
		border-color: ${({ theme }) => theme['color-base-surface-quaternary']};
		border-color: ${({ theme, active }) => (active ? theme['color-base-action-primary-default'] : theme['color-base-action-primary-default'])};
		&:hover {
			border-color: unset;
		}
	}
	@media (max-width: ${breakpoints.md}px) {
		width: 100% !important;
	}
`

export const MatchContentOddButton = styled(OddButton)<{ isHeader?: boolean }>`
	height: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	${TextXSMedium}
`
export const Odd = styled.div`
	flex: 1;
	text-align: center;
	${TextXSMedium}
`
export const OddBonus = styled.span`
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-state-success-fg']};
	margin-left: 4px;
`
