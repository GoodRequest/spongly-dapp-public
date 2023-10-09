import { Col, Divider, Row, Collapse } from 'antd'
import styled from 'styled-components'
import { TextLGMedium, TextSMMedium, TextXSMedium } from '@/styles/typography'
import { USER_TICKET_TYPE } from '@/utils/constants'
import { breakpoints } from '@/styles/theme'

const { Panel } = Collapse

export const UserCollapse = styled(Collapse)<{ isExpanded: boolean }>`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	margin-bottom: 24px;
	cursor: auto !important;
	.ant-collapse-expand-icon {
		display: ${({ collapsible }) => (collapsible === 'icon' ? 'block' : 'none !important')};
		color: white;
		font-size: 24px;
		position: absolute;
		height: 52px !important;
		width: 52px;
		border-radius: 12px;
		padding: 16px;
		right: 24px;
		top: 28px;
		padding-inline-end: 0 !important;
		padding-inline-start: 16px !important;
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		svg {
			transform: rotate(90deg) !important;
			width: 20px;
			height: 20px;
		}
		&:hover {
			background: ${({ theme }) => theme['color-base-action-primary-default']};
		}

		@media (max-width: ${breakpoints.md}px) {
			display: none !important;
		}
	}

	.ant-collapse-item {
		border: 2px solid transparent;
	}

	.ant-collapse-item-active {
		.ant-collapse-expand-icon {
			svg {
				transform: rotate(270deg) !important;
			}
		}
	}

	border: ${({ theme, isExpanded }) => (isExpanded ? `2px solid ${theme['color-base-surface-quintarny']}` : '2px solid transparent')};
`

export const CollapsePanel = styled(Panel)`
	.ant-collapse-content {
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		border-top: none;
	}
	.ant-collapse-content-box {
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		border-radius: 12px;
	}

	.ant-collapse-header {
		display: block !important;
	}
`
export const ButtonIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const CollapseButtonWrapper = styled.div`
	width: 100%;
	padding: 0 24px 16px 24px;
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const UserTicketTableRow = styled(Row)<{ show: boolean }>`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	padding: 8px;
	height: 80px;

	@media (max-width: ${breakpoints.md}px) {
		height: ${({ show }) => (show ? '280px' : 'fit-content')};
	}
`

export const CenterRowContent = styled(Col)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`

export const ClaimColContent = styled(Col)<{ show: boolean }>`
	display: ${({ show }) => (show ? 'flex' : 'none')};
	justify-content: center;
	flex-direction: column;
	align-items: center;
`

export const TagColContent = styled(Col)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	padding: 0px 16px 0px 16px;
	height: 100%;
	@media (max-width: ${breakpoints.md}px) {
		height: 40px;
	}
`

export const ColumnNameText = styled.span`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const ColumnValueText = styled.span`
	${TextLGMedium};
`

export const ClaimValueText = styled.span<{ userTicketType: USER_TICKET_TYPE }>`
	${TextLGMedium};
	color: ${({ userTicketType, theme }) => {
		if (userTicketType === USER_TICKET_TYPE.SUCCESS || userTicketType === USER_TICKET_TYPE.CANCELED) {
			return theme['color-base-state-success-fg']
		}
		if (userTicketType === USER_TICKET_TYPE.MISS) {
			return theme['color-base-state-error-fg']
		}
		return theme['color-base-content-top']
	}};
`

export const TxCol = styled(Col)`
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	@media (max-width: ${breakpoints.md}px) {
		height: 80px;
	}
`

export const TxIcon = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 10px;
`
export const TxHeader = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
`

export const AddressText = styled.p`
	${TextLGMedium};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
`

export const TicketTypeTag = styled.div<{ ticketType: USER_TICKET_TYPE }>`
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 48px;
	${TextSMMedium};
	background: ${({ ticketType, theme }) => {
		if (ticketType === USER_TICKET_TYPE.MISS) {
			return theme['color-base-state-error-bg']
		}
		if (ticketType === USER_TICKET_TYPE.SUCCESS) {
			return theme['color-base-state-success-bg']
		}
		return theme['color-base-surface-quaternary']
	}};
	color: ${({ ticketType, theme }) => {
		if (ticketType === USER_TICKET_TYPE.MISS || ticketType === USER_TICKET_TYPE.CANCELED) {
			return theme['color-base-state-error-fg']
		}
		if (ticketType === USER_TICKET_TYPE.SUCCESS) {
			return theme['color-base-state-success-fg']
		}
		return theme['color-base-content-top']
	}};
`

export const TicketDivider = styled(Divider)<{ showClaimed: boolean }>`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
		border-top: ${({ theme }) => `1px solid ${theme['color-base-surface-quintarny']}`};
		position: absolute;
		margin-top: ${({ showClaimed }) => (showClaimed ? '40px' : '100px')};
		left: 0px;
		z-index: 10;
	}
`

export const ClaimButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	${TextSMMedium}
`

export const ClaimText = styled.span`
	${TextSMMedium}
`

export const ClaimValue = styled.span`
	margin-top: -4px;
	${TextXSMedium}
`
export const StylesRow = styled(Row)`
	margin-top: 16px;
	@media (max-width: ${breakpoints.md}px) {
		margin-top: 16px;
	}
`
