import styled from 'styled-components'
import { Radio } from 'antd'
import { TextSMMedium } from '@/styles/typography'

export const RadioGroup = styled(Radio.Group)`
	display: flex;
	flex: 0 0 100%;
	gap: 12px;
	.ant-radio-button-wrapper-checked {
		border-radius: 8px !important;
		border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-disable']}`} !important;
		background: ${({ theme }) => theme['color-base-state-info-bg']} !important;
	}
	label {
		height: 44px;
		padding: 4px !important;
		flex: 1;
		display: flex;
		gap: 8px;
		justify-content: center;
		align-items: center;
		border-radius: 8px !important;
		border: ${({ theme }) => `2px solid ${theme['color-base-surface-quaternary']} !important;`}
		background: ${({ theme }) => theme['color-base-surface-quaternary']} !important;
		color: ${({ theme }) => theme['color-base-content-top']};
		&:hover {
			color: ${({ theme }) => theme['color-base-content-top']};
			border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-disable']}`} !important;
		}
		&::before {
			width: 0px !important;
		}
		${TextSMMedium}
	}

	.ant-radio-button-wrapper-disabled {
		opacity: 0.4 !important;
		&:hover {
			border: ${({ theme }) => `2px solid ${theme['color-base-surface-quaternary']}`} !important;
		}
	}
`

export const ErrorMessage = styled.div`
	color: ${({ theme }) => theme['color-base-state-error-bg']};
`
