import styled from 'styled-components'
import { Select as AntdSelect } from 'antd'

import { TextMDRegular, TextSMMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const SelectWrapper = styled.div`
	width: 100%;
`

export const Select = styled(AntdSelect)`
	// The reason for this is that Ant Design applies its own default styles to its components, which may have higher specificity or be applied later in the cascade than your custom styles. In order to override these default styles, you need to use the !important flag to ensure that your styles take precedence.
	width: 100%;
	.ant-select-suffix {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}

	.ant-select-selector {
		border: none !important;
		background-color: ${({ theme }) => theme['color-base-surface-tertiary']} !important;
		box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
		height: 60px !important;
		padding-right: 16px !important;
		padding-left: 16px !important;
		display: flex !important;
		align-items: center !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
		${TextMDRegular};
		@media (max-width: ${breakpoints.md}px) {
			height: 48px !important;
		}
		.ant-select-selection-placeholder {
			color: ${({ theme }) => theme['color-base-content-tertiary']} !important;
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

export const Title = styled.div`
	${TextSMMedium};
	margin-bottom: 4px;
`
