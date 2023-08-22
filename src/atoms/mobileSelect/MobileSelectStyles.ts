import styled from 'styled-components'
import { Select as AntdSelect } from 'antd'

import { TextLGMedium, TextSMMedium } from '@/styles/typography'

export const MobileSelect = styled(AntdSelect)`
	//The reason for this is that Ant Design applies its own default styles to its components, which may have higher specificity or be applied later in the cascade than your custom styles. In order to override these default styles, you need to use the !important flag to ensure that your styles take precedence.

	.ant-select-suffix {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}

	.ant-select-selector {
		border: none !important;
		background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
		height: 48px !important;
		display: flex !important;
		align-items: center !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
		${TextLGMedium};
		.ant-select-selection-item {
			color: ${({ theme }) => theme['color-base-content-top']} !important;
			display: flex;
			flex-direction: row;
		}
	}
`

export const MobileOptionWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	.flag {
		height: 20px;
		width: 20px;
		margin-right: 12px;
	}
`

export const MobileSelectWrapper = styled.div`
	margin-bottom: 24px;
	.ant-select {
		width: 100%;
	}

	.ant-select-dropdown {
		background-color: ${({ theme }) => theme['color-base-surface-secondary']};
	}

	.ant-select-item-option {
		${TextLGMedium};
		:hover {
			background-color: rgba(8, 9, 15, 0.6); // #08090f; TODO placeholder color
		}
	}

	.ant-select-item-option-selected {
		background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}
`

export const Title = styled.div`
	${TextSMMedium};
	margin-bottom: 4px;
`
