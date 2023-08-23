import styled from 'styled-components'
import { Empty, Row, Spin } from 'antd'
import infoIconPurple from '@/assets/icons/info-circle.svg'

import { TextMDMedium, TextXSMedium, HeadingXSMedium, TextMDRegular, TextSMMedium, HeadingSMMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'
import closeIcon from '@/assets/icons/x-close.svg'
import { AllPositionsHeader, MobileWrapper, OddButton, RadioMobileHeader } from '../matchesList/MatchesListStyles'

export const TicketBetWrapper = styled.div<{ rolledUp: boolean }>`
	position: sticky;
	top: 24px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	padding: 24px;
	@media (max-height: 930px) {
		padding: 16px;
	}
	@media (max-width: ${breakpoints.semixxl}px) {
		top: unset;
		display: flex;
		overflow-y: auto;
		flex-direction: column;
		transition: height 0.5s;
		height: ${({ rolledUp }) => (rolledUp ? '100%' : '80px')};
		position: fixed;
		bottom: 0px;
		background: ${({ theme }) => theme['color-base-surface-top']};
		padding: 16px;
		right: 0;
		width: 520px;
		z-index: 10;
		@media (min-width: ${breakpoints.semixxl}px) {
			display: none;
		}
		@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.semixxl}px) {
			border-radius: 12px 12px 0px 0px;
			right: 60px;
			overflow: hidden;
			height: ${({ rolledUp }) => (rolledUp ? 'auto' : '80px')};
			width: 440px;
			box-shadow: ${({ rolledUp }) =>
				rolledUp ? '0px -15px 30px -6px rgba(102, 116, 255, 0.04), 0px -25px 50px -12px rgba(102, 116, 255, 0.25);' : 'none'};
			background: ${({ theme }) => theme['color-base-surface-top']};
			@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.xl}px) {
				right: 24px;
			}
		}
		@media (max-width: ${breakpoints.md}px) {
			width: 100%;
		}
	}
	${TextMDMedium}
`

export const SummaryRow = styled(Row)`
	margin-bottom: 16px;
	${TextMDMedium};
`

export const PayWithRow = styled(Row)`
	margin: 32px 0px 0px 0px;
	${TextMDMedium}
	.ant-col {
		margin-bottom: 12px;
	}
`

export const InfoBox = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	background: ${({ theme }) => theme['color-base-state-error-bg']};
	width: 100%;
	padding: 6px 12px;
	border-radius: 8px;
	margin-bottom: 16px;
`

export const InfoBoxIcon = styled.div`
	width: 24px;
	height: 24px;
	background-image: url('${infoIconPurple}');
	margin-right: 12px;
`

export const InfoBoxContent = styled.div`
	${TextMDMedium};
	width: calc(100% - 64px);
	color: #ff6759;
`

export const Highlight = styled.span`
	font-weight: 700;
	color: white;
`

export const InfoBoxCloseIcon = styled.div`
	position: absolute;
	width: 24px;
	height: 24px;
	right: 12px;
	background-image: url('${closeIcon}');
	background-size: cover;
	border-radius: 4px;
	&:hover {
		background-color: ${({ theme }) => theme['color-base-surface-secondary']};
	}
`

export const Fee = styled.span`
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const BuyInTitle = styled.span`
	${TextMDMedium}
`

export const AvailableBalanceTitle = styled.span`
	${TextMDMedium}
`

export const AvailableBalance = styled.span<{ value?: number }>`
	${TextMDMedium};
	color: ${({ theme, value }) => (value && value > 0 ? theme['color-base-state-success-fg'] : theme['color-base-content-quaternary'])};
`

export const TicketMatchesWrapper = styled.div`
	position: relative;
	max-height: 336px;
	min-height: 66px;
	overflow-y: auto;
	@media (max-height: 930px) {
		max-height: calc(100vh - 588px);
	}
	@media (max-width: 993px) {
		max-height: calc(100vh - 465px);
	}
`

export const EmptyState = styled(Empty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 0px 0px 16px 0px;
	border-radius: 12px;
	padding: 52px;
	.ant-empty-description {
		div {
			margin-top: 28px;
			p {
				margin-bottom: 12px;
				line-height: 1.275em;
				${HeadingXSMedium}
			}
			span {
				${TextMDRegular}
			}
		}
	}
`

export const DeleteButton = styled.button<{ icon: string }>`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	cursor: pointer;
	padding: 20px;
	border: none;
	background: none;
	background-image: url('${({ icon }) => icon}');
	background-size: 24px;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 50%;
`

export const TicketChipses = styled.div<{ ref: any }>`
	display: none;
	flex-direction: row;
	overflow: hidden;
	margin-bottom: 20px;
	@media (min-width: ${breakpoints.semixxl}px) {
		display: flex;
	}
`

export const MatchBetOptionsWrapper = styled.div`
	width: 100%;
	div:first-of-type {
		margin-right: 0px !important;
		margin-left: 0px !important;
	}
	${MobileWrapper} {
		background: ${({ theme }) => theme['color-base-surface-secondary']};
	}
	${AllPositionsHeader} {
		display: none;
	}
	${OddButton} {
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
	}
	${RadioMobileHeader} {
		${TextXSMedium};
		justify-content: flex-start;
	}
`

export const TicketChips = styled.div<{ selected?: boolean; icon?: boolean }>`
	margin-top: 4px; // for space for CloseIcon
	position: relative;
	pointer-events: all;
	padding: ${({ icon }) => (icon ? '4px' : '12px 16px')};
	min-width: ${({ selected, icon }) => {
		if (selected) return 'fit-content'
		if (icon) return '32px'
		return '96px'
	}};
	(icon ? '42px' : selected ? 'fit-content' : '106px');
	height: 32px;
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	&:hover {
		background: ${({ selected, theme }) => (selected ? theme['color-base-action-primary-default'] : theme['color-base-surface-quintarny'])};
	}
	background: ${({ selected, theme }) => (selected ? theme['color-base-action-primary-default'] : theme['color-base-surface-quaternary'])};
	${TextSMMedium};
	font-weight: 700;
	cursor: pointer;
	border-radius: 8px;
	margin-right: 8px;
	display: flex;
	align-items: center;
`

export const CloseIcon = styled.div<{ src: string }>`
	position: absolute;
	top: -6px;
	right: -6px;
	border-radius: 999px;
	background-color: ${({ theme }) => theme['color-base-surface-quintarny']};
	height: 20px;
	border: ${({ theme }) => `2px solid ${theme['color-base-surface-secondary']}`};
	width: 20px;
	opacity: 0;
	background-image: ${({ src }) => `url(${src})`};
	background-repeat: no-repeat;
	background-position: center;
	background-size: 50%;
	${TicketChips}:hover & {
		opacity: 1;
	}
`

export const GradientLoss = styled.div<{ direction: 'right' | 'left' }>`
	position: absolute;
	pointer-events: none;
	right: ${({ direction }) => (direction === 'right' ? '15px' : 'none')};
	left: ${({ direction }) => (direction === 'left' ? '15px' : 'none')};
	transform: ${({ direction }) => (direction === 'left' ? 'rotate(180deg)' : 'none')};
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
	z-index: 10;
	width: 100px;
	display: flex;
	flex-direction: row-reverse;
	background: ${({ theme }) => ` linear-gradient(270deg, ${theme['color-base-surface-secondary']} 53%, rgba(34, 37, 49, 0) 100%`});
	${TicketChips} {
		width: 32px;
	}
`

export const ImgIcon = styled.img`
	height: 24px;
	width: 24px;
`

export const SpinWithoutSpinner = styled(Spin)`
	.ant-spin-dot {
		display: none;
	}
`

export const SubmittingSpinner = styled(Spin)`
	backdrop-filter: blur(2px);
	background: ${({ theme }) => ` linear-gradient(270deg, ${theme['color-base-surface-secondary']} 53%, rgba(34, 37, 49, 0) 100%`});;
	border-radius: 12px;
	max-height: 100% !important;
	.ant-spin-text {
		margin-top: 16px;
		padding-top: 16px;
		padding-bottom: 16px;
		${HeadingSMMedium};
		color: white;
	}
`

const fadeGradientAbove = (theme: any) => `linear-gradient(180deg, ${theme['color-base-surface-secondary']} 0%, rgba(34, 37, 49, 0) 100%)`
const fadeGradientUnder = (theme: any) => `linear-gradient(0deg, ${theme['color-base-surface-secondary']} 20%, rgba(34, 37, 49, 0) 100%)`

export const Fade = styled.div<{ show: boolean; direction: 'above' | 'under' }>`
	position: absolute;
	top: ${({ direction }) => (direction === 'above' ? '0px' : 'unset')};
	bottom: ${({ direction }) => (direction === 'under' ? '0px' : 'unset')};
	width: 100%;
	height: 20px;
	display: ${({ show }) => (show ? 'block' : 'none')};
	background: ${({ theme, direction }) => (direction === 'above' ? fadeGradientAbove(theme) : fadeGradientUnder(theme))};
`

export const TicketMatchesFaded = styled.div`
	position: relative;
`
