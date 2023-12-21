import styled from 'styled-components'
import { Tabs as AntdTabs } from 'antd'
import { TextSMMedium } from '@/styles/typography'

export const StyledTabs = styled(AntdTabs)`
	.ant-tabs-nav {
		&::before {
			display: none;
		}
		margin-bottom: 0;
	}
	.ant-tabs-ink-bar {
		display: none;
	}
	.ant-tabs-tab {
		${TextSMMedium};
		color: ${({ theme }) => theme['color-base-content-quintarny']};
		:hover:not(.ant-tabs-tab-active) {
			color: ${({ theme }) => theme['color-base-content-top']};
		}
	}
	.ant-tabs-tab-active {
		.ant-tabs-tab-btn {
			color: ${({ theme }) => theme['color-base-content-top']} !important;
			text-shadow: none !important;
		}
	}
`

export const Wrapper = styled.div`
	width: 100%;
`
