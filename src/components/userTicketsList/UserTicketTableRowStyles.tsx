import { Col, Divider, Row, Collapse } from 'antd'
import styled, { keyframes } from 'styled-components'
import { HeadingSMMedium, HeadingXSMedium, TextLGMedium, TextMDMedium, TextSMMedium, TextXSMedium } from '@/styles/typography'
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
		height: 48px !important;
		width: 48px;
		border-radius: 10px;
		padding: 16px;
		right: 24px;
		top: 28px;
		padding-inline-end: 0 !important;
		padding-inline-start: 14px !important;
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

export const CollapsePanel = styled(Panel)<{ isExpanded: boolean }>`
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
		border-bottom: 1px solid ${({ theme, isExpanded }) => (isExpanded ? theme['color-base-surface-quaternary'] : 'none')} !important;
		@media (max-width: ${breakpoints.md}px) {
			border-bottom: none !important;
		}
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
	@media (max-width: ${breakpoints.md}px) {
		align-items: flex-start;
	}
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
	@media (max-width: ${breakpoints.md}px) {
		max-width: 50%;
	}
`

export const TicketTypeTag = styled.div<{ ticketType: USER_TICKET_TYPE }>`
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 48px;
	${TextSMMedium};
	background: ${({ ticketType, theme }) => {
		if (ticketType === USER_TICKET_TYPE.MISS || ticketType === USER_TICKET_TYPE.CANCELED) {
			return theme['color-base-state-error-bg']
		}
		if (ticketType === USER_TICKET_TYPE.SUCCESS) {
			return theme['color-base-state-success-bg']
		}
		if (ticketType === USER_TICKET_TYPE.ONGOING) {
			return theme['color-base-state-warning-bg']
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
		if (ticketType === USER_TICKET_TYPE.ONGOING) {
			return theme['color-base-state-warning-fg']
		}
		return theme['color-base-content-top']
	}};
	@media (max-width: ${breakpoints.md}px) {
		border-radius: 6px;
		height: 32px;
	}
`

export const TicketDivider = styled(Divider)<{ showClaimed: boolean }>`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
		border-top: ${({ theme }) => `1px solid ${theme['color-base-surface-quintarny']}`};
		position: absolute;
		left: 0px;
		top: 124px;
		z-index: 10;
	}
`

export const ClaimButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	${TextSMMedium}
	@media (max-width: ${breakpoints.md}px) {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
`

export const ClaimText = styled.span`
	${TextSMMedium}
`

export const ClaimValue = styled.span`
	margin-top: -4px;
	${TextXSMedium};
	@media (max-width: ${breakpoints.md}px) {
		margin-top: 0;
		margin-left: 4px;
	}
`
export const StylesRow = styled(Row)`
	margin-top: 16px;
	@media (max-width: ${breakpoints.md}px) {
		margin-top: 16px;
	}
`

export const MatchContainerRow = styled(Col)`
	max-height: 304px;
	margin-bottom: 32px;
	overflow: auto;
	background: linear-gradient(360deg, #1d2046 0%, rgba(29, 32, 70, 0) 100%);
`

export const ModalDescription = styled(Col)`
	${TextMDMedium};
	text-align: center;
	margin-bottom: 32px;
	color: ${({ theme }) => theme['color-base-content-tertiary']};
`
const flicker = keyframes`
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
`

export const ModalDescriptionWarning = styled(Col)`
	${TextMDMedium};
	text-align: center;
	margin-bottom: 32px;
	animation: ${flicker} 1s infinite;
	color: ${({ theme }) => theme['color-base-state-warning-fg']};
`
export const ModalTitle = styled(Col)`
	${HeadingSMMedium};
	width: 75%;
	margin: 0 auto;
	text-align: center;
	margin-bottom: 12px;

	@media (max-width: ${breakpoints.md}px) {
		${HeadingXSMedium}
	}
`
