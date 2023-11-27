import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import { Row, Typography, Empty as AntdEmpty } from 'antd'
import { HeadingXSMedium, TextMDMedium, TextMDRegular, TextSMMedium, TextSorter, TextXSMedium } from '@/styles/typography'
import worldFlag from '@/assets/icons/world-flag.png'
import CheckIcon from '@/assets/icons/checked-select-icon.svg'
import { decodeSorter } from '@/utils/helpers'
import { TextLGMedium } from './typography'
import { breakpoints } from '@/styles/theme'

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

	.ant-select-dropdown {
		padding: 16px;
		background-color: ${({ theme }) => theme['color-base-surface-quaternary']}; !important;
		.ant-select-item-option {
			margin-bottom: 4px;
			padding: 12px;
			${TextMDRegular};
			:hover {
				background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
			}
		}
		// With checkbox icon
		&.checkbox-dropdown {
			.ant-select-item-option-selected {
				&::before {
					content: "";
					display: inline-block;
					width: 24px;
					height: 24px;
						background: url(${CheckIcon});
					background-size: cover;
					margin-right: 8px;
				}
			}
		}
		.ant-select-item-option-selected {
			background-color: ${({ theme }) => theme['color-base-surface-secondary']} !important;
			box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
			color: ${({ theme }) => theme['color-base-content-top']} !important;
		}
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
		.ant-notification-notice-wrapper {
			border-radius: 14px;
			.ant-notification-notice {
				height: 80px;
				border-radius: 12px;
				padding: 16px;
				background: ${({ theme }) => theme['color-base-surface-tertiary']};
				.ant-notification-notice-description {
					color: ${({ theme }) => theme['color-base-content-top']};
					margin-inline-start: 46px
				}
			}
			.ant-notification-notice::after {
				content: "";
				position: absolute;
				border-radius: 4px;
				bottom: 0;
				left: 50%;
				width: 90%;
				height: 4px;
				margin-left: -45%;
				margin-right: -45%;
			}
			.ant-notification-notice-icon {
				padding: 8px;
				border-radius: 8px;
				top: 20px;
			}
			.ant-notification-notice-error {
				box-shadow: 0px 15px 30px -6px rgba(225, 29, 72, 0.04), 0px 25px 50px -12px rgba(225, 29, 72, 0.25);
				.ant-notification-notice-icon {
					background: ${({ theme }) => theme['color-base-action-destructive-bg10']};
				}
			}
			.ant-notification-notice-error::after {
				background-color: ${({ theme }) => theme['color-base-action-destructive-default']};
			}
			.ant-notification-notice-warning {
				box-shadow: 0px 15px 30px -6px rgba(255, 136, 51, 0.04), 0px 25px 50px -12px rgba(255, 136, 51, 0.25);
				.ant-notification-notice-icon {
					background: ${({ theme }) => theme['color-base-state-warning-bg']};
				}
			}
			.ant-notification-notice-warning::after {
				background-color: ${({ theme }) => theme['color-base-state-warning-fg']};
			}
			.ant-notification-notice-info {
				box-shadow: 0px 15px 30px -6px rgba(102, 116, 255, 0.04), 0px 25px 50px -12px rgba(102, 116, 255, 0.25);
				.ant-notification-notice-icon {
					background: ${({ theme }) => theme['color-base-action-primary-bg10']};
				}
			}
			.ant-notification-notice-info::after {
				background-color: ${({ theme }) => theme['color-base-action-primary-default']};
			}
			.ant-notification-notice-success {
				box-shadow: 0px 15px 30px -6px rgba(168, 229, 138, 0.04), 0px 25px 50px -12px rgba(168, 229, 138, 0.25);
				.ant-notification-notice-icon {
					background: ${({ theme }) => theme['color-base-state-success-bg']};
				}
			}
			.ant-notification-notice-success::after {
				background-color: ${({ theme }) => theme['color-base-state-success-fg']};
			}
		}

	}

	.ticket-select {
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
export const flicker = keyframes`
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
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

export const Sorter = styled.div<{ sorterName: any; disabled?: boolean }>`
	${TextSorter};
	display: inline-flex;
	align-items: center;
	height: 32px;
	border-radius: 4px;
	padding: 4px 8px 4px 0;
	cursor: ${({ sorterName, disabled }) => (disabled ? 'not-allowed' : sorterName ? 'pointer' : 'default')};
	${(p) =>
		p.sorterName &&
		p.sorterName === decodeSorter().property &&
		css`
			color: ${({ theme }) => theme['color-base-action-primary-default']};
		`}

	img {
		padding: 0;
		margin-right: 8px;
		margin-left: 0;
		width: 20px;
		height: 20px;
	}
`

export const SorterRow = styled.div`
	margin-top: 16px;
	margin-bottom: 16px;
	display: flex;
	width: 100%;
`

export const HorizontalSorters = styled(Row)<{ $horizontalSpacing?: number }>`
	padding-left: ${({ $horizontalSpacing }) => $horizontalSpacing || 24}px;
	padding-right: ${({ $horizontalSpacing }) => $horizontalSpacing || 24}px;
	display: flex;
	width: 100%;
	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const SelectSorters = styled.div`
	display: none;
	@media (max-width: ${breakpoints.md}px) {
		width: 100% !important;
		display: flex;
	}
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

export const LoadMore = styled.div`
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	${TextMDMedium};
	cursor: pointer;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-action-secondary-default']};
	transition: background 300ms;
	&:hover {
		background: ${({ theme }) => theme['color-base-action-primary-default']};
	}
	@media (max-width: ${breakpoints.md}px) {
		height: 48px;
	}
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
	@media (max-width: ${breakpoints.md}px) {
		${TextXSMedium};
		color: ${({ theme }) => theme['color-base-content-top']};
	}
`
export const Empty = styled(AntdEmpty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
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
export const LeagueIcon = styled.i<{ xlSize?: number; mdSize?: number }>`
	color: ${({ theme }) => theme['color-base-content-top']};
	line-height: normal !important;
	font-size: ${({ xlSize }) => (xlSize ? `${xlSize}px` : '90px')};
	font-style: normal;
	@media (max-width: ${breakpoints.md}px) {
		font-size: ${({ mdSize }) => (mdSize ? `${mdSize}px` : '60px')};
	}
`

export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	height: 40px;
	width: 40px;
	border-radius: 999px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border: 2px solid ${({ theme }) => theme['color-base-surface-secondary']};
	&:last-of-type {
		margin-left: -14px;
	}
	img {
		padding: 4px;
		width: 36px;
		height: 36px;
	}
`

export const BasicBoxShadow = css`
	box-shadow: 0px 0px 4px 0px #6674ff, 0px 0px 16px 0px rgba(102, 116, 255, 0.85);
`
