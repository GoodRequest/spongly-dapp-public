import styled from 'styled-components'
import { Select as AntdSelect } from 'antd'

import { TextLGMedium, TextSMMedium } from '@/styles/typography'

export const Select = styled(AntdSelect)`
	// The reason for this is that Ant Design applies its own default styles to its components, which may have higher specificity or be applied later in the cascade than your custom styles. In order to override these default styles, you need to use the !important flag to ensure that your styles take precedence.
	.ant-select-suffix {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}

	.ant-select-selector {
		border: none !important;
		background-color: ${({ theme }) => theme['color-base-surface-quaternary']} !important;
		box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
		height: 60px !important;
		display: flex !important;
		align-items: center !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
		${TextLGMedium};
		.ant-select-selection-placeholder {
			color: ${({ theme }) => theme['color-base-content-top']} !important;
		}
		.ant-select-selection-item {
			color: ${({ theme }) => theme['color-base-content-top']} !important;
		}
	}
	.ant-select-clear {
		width: 16px;
		height: 16px;
		background: none;
		background: ${({ theme }) => theme['color-base-surface-top']};
		border-radius: 999px;
		padding: 2px;
		margin-top: -8px;
	}
`

export const SelectWrapper = styled.div`
	width: 100%;
	.ant-select {
		width: 100%;
	}

	.ant-select-dropdown {
		background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	}

	.ant-select-item-option {
		margin-top: 4px;
		${TextLGMedium};
		:hover {
			background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		}
	}

	.ant-select-item-option-selected {
		background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}
`
export const SelectLabel = styled.div`
	display: flex;
	align-items: center;
`

export const Title = styled.div`
	${TextSMMedium};
	margin-bottom: 4px;
`
