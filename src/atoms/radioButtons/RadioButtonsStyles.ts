import styled from 'styled-components'
import { Radio } from 'antd'

import { TextLGMedium } from '@/styles/typography'

export const RadioGroup = styled(Radio.Group)`
	height: 60px;
	display: flex;
	flex-direction: row;
	margin-bottom: 20px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 8px;
	& .ant-radio-button-wrapper {
		border: 0px;
	}

	& .ant-radio-button-wrapper:not(:first-child)::before {
		background: transparent;
	}

	& .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
		background: ${({ theme }) => theme['color-base-surface-quintarny']};
	}
`

export const ContentWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 8px;
`

export const CountBubble = styled.span`
	display: flex;
	border-radius: 50%;
	min-width: 26px;
	min-height: 26px;
	background: ${({ theme }) => theme['color-base-state-success-fg']};
	color: ${({ theme }) => theme['color-base-surface-top']};
	align-items: center;
	justify-content: center;
`

export const RadioButton = styled(Radio.Button)<{ minimized?: boolean }>`
	${TextLGMedium};
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: ${({ minimized }) => (minimized ? 'fit-content' : '100%')};
	padding: ${({ minimized }) => (minimized ? '0 32px 0 32px' : 'none')};
	height: calc(100% - 4px) !important;
	flex-direction: row;
	border-radius: 8px;
	border: 0px;
	margin: 2px;
	line-height: 1em !important;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	color: ${({ theme }) => theme['color-base-content-top']};
	overflow: hidden;
	:hover {
		color: ${({ theme }) => theme['color-base-content-top']};
		background: ${({ theme }) => theme['color-base-surface-quintarny']};
	}
`
