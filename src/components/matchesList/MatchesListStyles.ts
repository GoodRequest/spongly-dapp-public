import styled from 'styled-components'
import { Col, Collapse, Divider, Radio, Row, Skeleton } from 'antd'
import Ticket from '@/assets/images/empty_state_ticket.png'
import { HeadingXXSMedium, TextMDMedium, TextMDRegular, TextSMMedium, TextSMRegular, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'
import { MATCHES } from '@/utils/enums'

const { Panel } = Collapse

export const MatchListWrapper = styled.div`
	border-radius: 12px;
	padding-top: 24px;
	margin-bottom: 40px;
	${TextSMMedium}
`

export const MatchCollapse = styled(Collapse)<{ isExpanded: boolean }>`
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
		top: 36px;
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
		@media (max-width: ${breakpoints.semixxl}px) {
			top: 54px;
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

export const OddsWrapper = styled.div`
	width: 100%;
	display: flex;
	gap: 12px;
`

export const ExtendedOddsWrapper = styled(OddsWrapper)`
	gap: 24px;
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
`

export const PanelContent = styled.div`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	${TextXSMedium}
`

export const MatchItemRow = styled(Row)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	max-width: 977px;
	${TextSMMedium};
	width: calc(100% - 40px);
	@media (max-width: ${breakpoints.semixxl}px) {
		width: calc(100% - 72px);
	}
	@media (max-width: ${breakpoints.md}px) {
		width: 100%;
	}
`

export const MatchItemCol = styled(Col)<{ $alignItems?: string }>`
	display: flex;
	align-items: ${({ $alignItems }) => $alignItems || 'center'};
	justify-content: center;
	border-radius: 12px;
	margin-top: auto;
	margin-bottom: auto;
	flex-direction: column;
`

export const ExtendedMatchContentWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 15px;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const SmallMatchContentWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const ExtendedMatchContentItemCol = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 8px;
	align-items: center;
	padding: 16px 24px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border-radius: 15px;
`
export const WarningText = styled.div`
	height: 42px;
	color: ${({ theme }) => theme['color-base-state-warning-fg']};
`
export const ExtendedMatchContentItemHeader = styled.div`
	${TextMDMedium}
`

export const ModalDescriptionText = styled.div`
	color: ${({ theme }) => theme['color-base-content-tertiary']};
`

export const Header = styled.div`
	margin-bottom: 6px;
	text-align: left;
	${TextXSMedium};

	@media (max-width: ${breakpoints.md}px) {
		text-align: left;
	}
`

export const RowItemContent = styled.div`
	display: flex;
	gap: 4px;
	flex-direction: column;
	align-items: center;
	flex-wrap: nowrap;
`

export const ExtendedRowItemContent = styled(RowItemContent)`
	width: 100%;
	height: auto;
	gap: 8px;
`

export const TeamImage = styled.div`
	height: 60px;
	width: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background-size: 25px;
	border: 2px solid ${({ theme }) => theme['color-base-surface-secondary']};
	background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	&:nth-of-type(2) {
		margin-left: -16px;
	}
	img {
		height: 50%;
		width: 50%;
	}
`

export const RadioGroup = styled(Radio.Group)`
	display: flex;
	gap: 12px;
	label {
		text-align: center;
		&.ant-radio-button-wrapper {
			border-inline-start: 2px solid ${({ theme }) => theme['color-base-surface-quaternary']};
		}
		&::before {
			display: none !important;
		}
		&:hover {
			border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']};
			color: white;
		}
	}
	@media (max-width: ${breakpoints.md}px) {
		width: 100%;
		flex-direction: row;
		justify-content: space-between;
	}
`

export const RadioMobileGroup = styled(Radio.Group)`
	height: 32px;
	display: flex;
	flex-direction: row;
	gap: 8px;
	margin-top: 8px;
	margin-bottom: 8px;
	border-radius: 6px;

	& .ant-radio-button-wrapper:not(:first-child)::before {
		background: transparent;
	}

	& .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
		background: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		border: 2px solid ${({ theme }) => theme['color-base-action-primary-default']} !important;
	}
`

export const ExtendedMatchContentRadioButtonGroup = styled(RadioGroup)`
	display: flex;
	gap: 8px;
	width: 100%;
`

export const StatusWrapper = styled.div`
	display: flex;
	gap: 4px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: nowrap;
	padding: 20px;
	text-align: center;
	width: 216px;
	height: 60px;
	border-radius: 6px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	${TextXSMedium}
`

export const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

export const LoadMore = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 60px;
	${TextMDMedium};
	cursor: pointer;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-action-secondary-default']};
	&:hover {
		background: ${({ theme }) => theme['color-base-action-primary-default']};
	}
	@media (max-width: ${breakpoints.md}px) {
		height: 48px;
	}
`

export const EmptyImage = styled.div`
	height: 74px;
	width: 124px;
	background: url(${Ticket});
	background-size: 124px 74px;
	background-repeat: no-repeat;
	background-position: center;
	background-align: center;
`

export const RowSkeleton = styled(Skeleton)`
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

export const MatchItemEmptyState = styled.div`
	padding: 40px 60px;
	height: 154px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 0 16px 0;
	color: white;
	border-radius: 12px;
	h4 {
		${HeadingXXSMedium};
	}
	p {
		${TextMDRegular};
	}

	@media (max-width: ${breakpoints.md}px) {
		h4 {
			margin-top: -12px;
			font-size: 1.25rem;
		}
		p {
			margin-top: 12px;
			${TextSMRegular};
		}
	}
`

export const MobileTeamsContent = styled.div`
	display: flex;
	margin-top: 8px;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
`

export const MobileDivider = styled(Divider)`
	border-top: ${({ theme }) => `1px solid ${theme['color-base-action-secondary-default']}`};
`

export const ButtonIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const RadioMobileHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	${TextXSMedium}
`

export const MobileStatusWrapper = styled.div<{ type: MATCHES }>`
	width: 100%;
	height: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	margin-top: 16px;
	${TextXSMedium};
	background: ${({ theme, type }) => (type === MATCHES.ONGOING ? theme['color-base-state-warning-bg'] : theme['color-base-surface-quaternary'])};
	color: ${({ theme, type }) => (type === MATCHES.ONGOING ? theme['color-base-state-warning-fg'] : theme['color-base-content-top'])};
`

export const MobileWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	padding: 12px 12px 12px 12px;
	margin-bottom: 16px;
	&:last-child {
		margin-bottom: 0;
	}
`

export const AllPositionsHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
	${TextMDMedium}
`

export const NoWrapCenterRow = styled(Row)`
	display: flex;
	align-items: center;
`
export const FlexCol = styled(Col)<{ isTotalWinner?: boolean }>`
	display: flex;
	width: ${({ isTotalWinner }) => (isTotalWinner ? '80px' : '120px')};
	flex-direction: row;
`

export const FlexCenterCol = styled(Col)`
	width: calc(100% - 120px);
	display: flex;
	flex-direction: column;
	justify-content: center;
`
export const CollapseButtonWrapper = styled.div`
	display: none;
	width: 100%;
	padding: 0 16px 16px 16px;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const XXLWrapper = styled.div`
	display: block;

	@media (max-width: ${breakpoints.semixxl}px) {
		display: none;
	}
`

export const SEMIXXLWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.semixxl}px) {
		display: block;
	}

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const MDWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: flex;
	}
`

export const MobileContentWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const PCContentWrapper = styled.div`
	display: block;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`
