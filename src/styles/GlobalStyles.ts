import styled, { createGlobalStyle, css } from 'styled-components'
import { Row, Typography, Empty as AntdEmpty } from 'antd'
import { HeadingXSMedium, TextMDMedium, TextMDRegular, TextSMMedium, TextSorter } from '@/styles/typography'
import worldFlag from '@/assets/icons/world-flag.png'
import { decodeSorter } from '@/utils/helpers'
import { TextLGMedium } from './typography'

const { Paragraph } = Typography
export const GlobalStyle = createGlobalStyle`
	body {
		background: ${({ theme }) => theme['color-spongly-cool-gray-900']};
	}

	html {
		scroll-behavior: smooth;
	}

	input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    	-webkit-appearance: none;
    	margin: 0;
	}

	input[type=number] {
    	-moz-appearance:textfield; /* Firefox */
	}

	#nprogress {
		.bar {
			background: #FFFF33 !important
		}
		.peg {
			box-shadow: 0 0 10px #FFFF33;
		}
		.spinner-icon {
			border-top-color: #FFFF33;
			border-left-color: #FFFF33;
			@media (max-width: 991.98px) {
				display: none;
			}
		}
	}

	.rc-virtual-list-scrollbar-thumb {
		background: ${({ theme }) => theme['color-base-action-primary-default']} !important;
	}
	// Antd Notifications
	.ant-notification {
		.ant-notification-notice {
			height: 80px;
			border-radius: 12px;
			background: ${({ theme }) => theme['color-base-surface-tertiary']};
			.ant-notification-notice-description {
				color: white
			}
		}
		.ant-notification-notice::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 50%;
			width: 90%;
			height: 4px;
			margin-left: -45%;
			margin-right: -45%;
		}
		.ant-notification-notice-error {
			box-shadow: 0px 15px 30px -6px rgba(225, 29, 72, 0.04), 0px 25px 50px -12px rgba(225, 29, 72, 0.25);
		}
		.ant-notification-notice-error::after {
			background-color: ${({ theme }) => theme['color-base-action-destructive-default']};
		}
		.ant-notification-notice-warning {
			box-shadow: 0px 15px 30px -6px rgba(255, 136, 51, 0.04), 0px 25px 50px -12px rgba(255, 136, 51, 0.25);
		}
		.ant-notification-notice-warning::after {
			background-color: ${({ theme }) => theme['color-base-state-warning-fg']};
		}
		.ant-notification-notice-info {
			box-shadow: 0px 15px 30px -6px rgba(102, 116, 255, 0.04), 0px 25px 50px -12px rgba(102, 116, 255, 0.25);
		}
		.ant-notification-notice-info::after {
			background-color: ${({ theme }) => theme['color-base-action-primary-default']};
		}
		.ant-notification-notice-success {
			box-shadow: 0px 15px 30px -6px rgba(168, 229, 138, 0.04), 0px 25px 50px -12px rgba(168, 229, 138, 0.25);
		}
		.ant-notification-notice-success::after {
			background-color: ${({ theme }) => theme['color-base-state-success-fg']};
		}

	}

	.ticket-select, .odds-select {
		&.ant-select-dropdown {
			background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
		}

		.ant-select-item-option {
			${TextLGMedium};
			:hover {
				background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
			}
		}

		.ant-select-item-option-selected {
			background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
			color: ${({ theme }) => theme['color-base-content-top']} !important;
		}
	}

	.ant-popover-content {
		border-radius: 12px;
		.ant-popover-inner {
		background: ${({ theme }) => theme['color-base-surface-tertiary']} !important;
		.ant-popover-title {
			color: ${({ theme }) => theme['color-base-content-top']} !important;
			${TextSMMedium};
		}
	}
	}
`
export const FlexItemCenter = css`
	display: flex;
	align-items: center;
	justify-content: center;
`

export const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
`

export const FlexRow = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
	gap: 16px;
`

export const Sorter = styled.div<{ sorterName: any }>`
	${TextSorter};
	display: inline-flex;
	align-items: center;
	height: 32px;
	border-radius: 4px;
	padding: 4px 8px 4px 0;
	cursor: ${({ sorterName }) => (sorterName ? 'pointer' : 'default')};
	${(p) =>
		p.sorterName &&
		p.sorterName === decodeSorter().property &&
		css`
			color: ${({ theme }) => theme['color-base-action-primary-default']};
		`}

	img {
		padding: 0;
		margin-right: 8px;
		width: 20px;
		height: 20px;
	}
`

export const SorterRow = styled(Row)`
	margin-top: 16px;
	margin-bottom: 16px;
`
export const FlagWorld = styled.div`
	height: 20px;
	width: 20px;
	margin-right: 12px;
	background: url(${worldFlag});
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
`
export const Icon = styled.span<{ icon: string; degree?: number }>`
	padding: 20px;
	background-image: url('${({ icon }) => icon}');
	background-size: 20px;
	background-position: center;
	background-repeat: no-repeat;
	display: inline-block;
	transform: rotate(${({ degree }) => degree}deg);
`
export const EllipsisText = styled(Paragraph)`
	// NOTE: Use  <SCS.EllipsisText title={title} ellipsis={{ rows: 1, expandable: false }}>{title}</SCS.EllipsisText>
	${TextMDMedium};
	margin-bottom: 0 !important;
	color: ${({ theme }) => theme['color-base-content-top']};
`
export const Empty = styled(AntdEmpty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 0px 16px 0px;
	border-radius: 12px;
	padding: 52px;
	.ant-empty-description {
		div {
			margin-top: 28px;
			p {
				margin-bottom: 16px;
				${HeadingXSMedium}
			}
			span {
				${TextMDRegular}
			}
		}
	}
`
