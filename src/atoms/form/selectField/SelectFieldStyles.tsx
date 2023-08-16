import styled from 'styled-components'
import { TextLGMedium, TextSMMedium } from '@/styles/typography'

export const SelectWrapper = styled.div<{ width?: number; bordered?: boolean; bolded?: boolean; isError?: boolean }>`
	.ant-select {
		height: 36px;
		width: 54px;
		.ant-select-selector {
			${TextSMMedium};
			display: flex;
			justify-content: center;
			align-items: center;
			height: 36px;
			width: 54px;
			border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-default']}`};
			background-color: ${({ theme }) => theme['color-base-state-info-bg']} !important;
			&:hover {
				border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-default']}`} !important;
			}
		}
		.ant-select-arrow {
			display: none;
		}
		.ant-select-selection-item {
			padding: 0;
			text-align: center;
			color: ${({ theme }) => theme['color-base-content-top']} !important;
		}
	}

	.ant-select-disabled {
		.ant-select-selector {
			.ant-select-selection-item {
				color: ${({ theme }) => theme['color-base-content-top']} !important;
			}
		}
		.ant-select-focused {
			box-shadow: none !important;
			.ant-select-selector {
				box-shadow: none !important;
			}
			.ant-select-selection-item {
				color: ${({ theme }) => theme['color-base-content-top']} !important;
			}
		}
		.ant-select-dropdown {
			background-color: ${({ theme }) => theme['color-base-surface-secondary']};
		}
	}
`

export const DropdownWrapper = styled.div`
	background-color: ${({ theme }) => theme['color-base-surface-secondary']};
	.ant-select-item {
		${TextLGMedium};
	}
`
