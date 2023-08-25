import styled from 'styled-components'
import { Button } from 'antd'
import { TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const OddButton = styled(Button)<{ active?: boolean; isMobilePanel?: boolean }>`
	height: 32px;
	width: 62px;
	border-radius: 6px;
	background: ${({ theme, active, isMobilePanel }) =>
		active
			? isMobilePanel
				? theme['color-base-state-info-bg']
				: theme['color-base-surface-secondary']
			: isMobilePanel
			? theme['color-base-surface-secondary']
			: theme['color-base-surface-quaternary']};
	border: 2px solid ${({ theme, active }) => (active ? theme['color-base-action-primary-default'] : theme['color-base-surface-quaternary'])} !important;
	box-shadow: none;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0px;
	${TextXSMedium};
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
		border-color: ${({ theme, active }) => (active ? theme['color-base-action-primary-default'] : theme['color-base-surface-quaternary'])};
		&:hover {
			border-color: ${({ theme }) => theme['color-base-surface-quaternary']};
		}
	}
	@media (max-width: ${breakpoints.md}px) {
		width: 100% !important;
	}
`
export const MatchContentOddButton = styled(OddButton)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 42px;
	background: ${({ theme, active }) => (active ? theme['color-base-surface-secondary'] : theme['color-base-surface-secondary'])};
	flex: 1;
	${TextXSMedium}
	&:disabled {
		background: ${({ theme }) => theme['color-base-surface-quaternary']} !important;
	}
`
