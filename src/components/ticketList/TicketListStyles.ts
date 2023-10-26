import styled, { css, keyframes } from 'styled-components'
import { Row, Col, Skeleton, Collapse } from 'antd'
import {
	HeadingSMMedium,
	HeadingXSMedium,
	HeadingXXSMedium,
	TextLGMedium,
	TextLGRegular,
	TextMDMedium,
	TextMDRegular,
	TextSMMedium,
	TextXSMedium
} from '@/styles/typography'
import Ticket from '@/assets/images/empty_state_ticket.png'
import { CLOSED_TICKET_TYPE, TICKET_TYPE } from '@/utils/constants'
import { breakpoints } from '@/styles/theme'

const { Panel } = Collapse

export const TicketListWrapper = styled.div`
	border-radius: 12px;
	min-height: 437px;
	margin-bottom: 40px;
	${HeadingSMMedium}
`

export const TicketItemRow = styled(Row)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	overflow: auto;
	margin-bottom: 0;
	padding: 16px;
	${TextSMMedium};
	@media (max-width: ${breakpoints.md}px) {
		padding: 0;
		top: 160px;
	}
}
`

export const TicketItemTipsterWrapper = styled.div`
	display: contents;
	cursor: pointer;
`
export const StylesRow = styled(Row)`
	margin-top: 16px;
	@media (max-width: ${breakpoints.md}px) {
		margin-top: 16px;
	}
`
export const ColHeader = styled.div`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const ColContent = styled.div`
	${TextLGMedium};
	.ant-spin {
		span {
			color: ${({ theme }) => theme['color-base-content-top']};
			font-size: 18px;
		}
	}
`

export const TicketIcon = styled.div<{ imageSrc: number }>`
	height: 48px;
	width: 48px;
	border-radius: 50%;
	background: url(${({ imageSrc }) => imageSrc});
	background-size: 75%;
	background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	background-repeat: no-repeat;
	background-position: center;
`

export const RowSkeleton = styled(Skeleton)`
	margin-bottom: 16px;
	.ant-skeleton-content {
		padding: 40px 60px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		margin: 16px 0 16px 0;
		border-radius: 12px;
		h3,
		ul li {
			&::after {
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(0, 0, 0, 0.2) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
			}
		}
	}
`

export const TicketItemEmptyState = styled.div`
	padding: 40px 60px;
	height: 154px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 0 16px 0;
	color: white;
	border-radius: 12px;
	h4 {
		${HeadingXXSMedium}
	}
	p {
		${TextMDRegular}
	}
`

export const EmptyImage = styled.div`
	height: 74px;
	width: 124px;
	background: url(${Ticket});
	background-size: 124px 74px;
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
export const TicketCollapse = styled(Collapse)<{ isExpanded: boolean }>`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	margin-bottom: 24px;
	border: none;

	.ant-collapse-item {
		border-bottom: none;
		border: 2px solid transparent;
	}
	@media (max-width: ${breakpoints.md}px) {
		padding: 16px;
	}
	.ant-collapse-expand-icon {
		color: white;
		font-size: 24px;
		position: absolute;
		height: 48px !important;
		width: 48px;
		border-radius: 12px;
		padding: 16px;
		right: 16px;
		top: 16px;
		padding-inline-end: 0 !important;
		padding-inline-start: 14px !important;
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		svg {
			transform: rotate(90deg);
			width: 20px;
			height: 20px;
		}
		&:hover {
			background: ${({ theme }) => theme['color-base-action-primary-default']};
		}
		@media (max-width: ${breakpoints.md}px) {
			display: flex;
			justify-content: center;
			left: 0;
			right: 0;
			width: 100%;
			margin: 0 auto;
			top: unset;
			bottom: 0;
			height: 32px !important;
		}
	}

	.ant-collapse-item-active {
		.ant-collapse-expand-icon {
			svg {
				transform: rotate(270deg) !important;
			}
		}
	}
`

export const ColapsePanel = styled(Panel)`
	padding: 0px 8px 0px 8px !important;
	.ant-collapse-header {
		padding: 0 !important;
		@media (max-width: ${breakpoints.md}px) {
			padding-bottom: 44px !important;
			padding-left: 0 !important;
			padding-right: 0 !important;
		}
	}
	.ant-collapse-content {
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		border-top: none;
	}
	.ant-collapse-content-box {
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		border-radius: 12px;
		@media (max-width: ${breakpoints.md}px) {
			padding: 0 !important;
		}
	}

	@media (max-width: ${breakpoints.md}px) {
		padding: 0 !important;
	}
`

export const SportIcon = styled.div<{ numberOfSport: number }>`
	// TODO fix icon
	position: absolute;
	z-index: 999;
	width: 28px;
	height: 28px;
	top: 36px;
	left: -14px;
	background: ${({ theme }) => theme['color-base-action-primary-default']};
	border: 2px solid ${({ theme }) => theme['color-base-surface-tertiary']};
	border-radius: 100px;
	text-align: center;
	span {
		color: ${({ theme }) => theme['color-base-content-top']};
		margin-right: 0;
		font-size: 16px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	${(props) =>
		props.numberOfSport > 1 &&
		css`
			height: 46px;
			font-size: 13px;
			display: flex;
			flex-direction: column;
			.description {
				font-size: 13px;
				line-height: 13px;
			}
		`}
`
export const PanelContent = styled.div`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	${TextXSMedium}
`

export const Separator = styled.div`
	width: 48px;
	border-bottom: 1.5px solid ${({ theme }) => theme['color-base-surface-quintarny']};
	transform: rotate(90deg);
	margin-top: 24px;
	@media (max-width: ${breakpoints.md}px) {
		height: 1px;
		width: 100%;
		transform: rotate(0deg);
		margin-top: 16px;
		margin-bottom: 16px;
	}
`

export const TicketType = styled.div<{ ticketType: TICKET_TYPE | CLOSED_TICKET_TYPE }>`
	border-radius: 6px;
	text-align: center;
	padding: 12px;
	width: 80%;
	@media (max-width: ${breakpoints.md}px) {
		width: 100%;
		padding-top: 6px;
		padding-bottom: 6px;
		margin-bottom: 16px;
	}
	${(props) =>
		props.ticketType === TICKET_TYPE.ONGOING_TICKET &&
		css`
			background: rgba(255, 136, 51, 0.15);
			color: ${({ theme }) => theme['color-base-state-warning-fg']};
		`}

	${(props) =>
		props.ticketType === CLOSED_TICKET_TYPE.SUCCESS &&
		css`
			background: rgba(168, 229, 138, 0.15);
			color: ${({ theme }) => theme['color-base-state-success-fg']};
		`}

	${(props) =>
		(props.ticketType === CLOSED_TICKET_TYPE.MISS || props.ticketType === CLOSED_TICKET_TYPE.CANCELLED) &&
		css`
			background: rgba(255, 103, 89, 0.15);
			color: ${({ theme }) => theme['color-base-state-error-fg']};
		`}
`

export const PCRow = styled(Row)<{ type: TICKET_TYPE }>`
	display: flex;
	margin-bottom: 16px;
	@media (max-width: ${breakpoints.md}px) {
		display: ${({ type }) => (type === TICKET_TYPE.HOT_TICKET ? 'block' : 'none')};
	}
`

export const HotTicketDescription = styled.span`
	${TextLGRegular};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
