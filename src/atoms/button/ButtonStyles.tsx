import styled from 'styled-components'
import { Button as AntdButton, Popover as AntdPopover } from 'antd'
import { TextMDMedium } from '@/styles/typography'
import { FIELD_HEIGHT } from '@/utils/constants'

export const PrimaryButton = styled(AntdButton)`
	height: ${FIELD_HEIGHT.middle};
	background: ${({ theme }) => theme['color-base-action-primary-default']};
	border-radius: 10px;
	width: 100%;
	box-shadow: none;
	${TextMDMedium}
	&.ant-btn-sm {
		height: ${FIELD_HEIGHT.small};
		border-radius: 8px;
	}
	&.ant-btn-lg {
		border-radius: 12px;
		height: ${FIELD_HEIGHT.large};
	}
	:hover:not(:disabled) {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-action-primary-hover']} !important;
	}
	:disabled {
		background: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		color: ${({ theme }) => theme['color-base-content-quaternary']} !important;
		border: none !important;
	}
	&.make-bet-button:disabled {
		background: ${({ theme }) => theme['color-base-action-secondary-default']} !important;
	}
	&.make-bet-button.isProcessing {
		cursor: not-allowed;
		:hover {
			background: ${({ theme }) => theme['color-base-action-primary-default']} !important;
		}
	}
`

export const SecondaryButton = styled(AntdButton)`
	height: ${FIELD_HEIGHT.middle};
	background: ${({ theme }) => theme['color-base-action-secondary-default']} !important;
	border-radius: 8px;
	border: none;
	width: 100%;
	box-shadow: none;
	${TextMDMedium}
	&.ant-btn-sm {
		height: ${FIELD_HEIGHT.small};
		border-radius: 8px;
	}
	&.ant-btn-lg {
		border-radius: 12px;
		height: ${FIELD_HEIGHT.large};
	}
	:hover:not(:disabled) {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-action-secondary-hover']} !important;
	}
	:disabled {
		background: ${({ theme }) => theme['color-base-action-secondary-disable']} !important;
		color: ${({ theme }) => theme['color-base-content-quaternary']} !important;
	}
`
export const TertiaryButton = styled(AntdButton)`
	height: 48px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	width: 100%;
	box-shadow: none;
	${TextMDMedium}

	:hover {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-surface-tertiary']} !important;
	}
`

export const Popover = styled(AntdPopover)`
	width: 100%;
`
