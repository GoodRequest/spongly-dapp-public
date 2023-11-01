import styled, { css } from 'styled-components'

import { HeadingXSMedium, TextLGMedium, TextSMMedium, TextXLSemibold } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const Image = styled.img<{ filled: boolean; isAddress?: boolean }>`
	width: ${({ filled }) => (filled ? '68px' : '40px')};
	height: ${({ filled }) => (filled ? '68px' : '71px')};
	${({ isAddress }) =>
		isAddress &&
		css`
			padding: 8px;
			border-radius: 999px;
			background: ${({ theme }) => theme['color-base-surface-quintarny']};
		`}
	@media (max-width: ${breakpoints.lg}px) {
		margin-right: 8px;
	}
`
export const ColorWrapper = styled.div<{ filled: boolean }>`
	background: ${({ theme, filled }) => (filled ? theme['color-base-surface-secondary'] : 'transparent')};
	width: 100%;
	border-radius: 12px;
	cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`

export const StatisticCard = styled.div<{ filled: boolean; showMobileInColumn: boolean; addMobileBackground: boolean }>`
	width: 100%;
	border-radius: 12px;
	padding: 8px;
	height: 108px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background: ${({ filled }) => (filled ? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 200px)' : 'transparent')};
	box-shadow: ${({ theme, filled }) => (filled ? theme['drop-shadow-xs'] : 'none')};
	@media (max-width: ${breakpoints.lg}px) {
		padding: 16px 12px;
		height: 68px;
		justify-content: ${({ showMobileInColumn }) => (showMobileInColumn ? 'center' : 'flex-start')};
		align-items: ${({ showMobileInColumn }) => (showMobileInColumn ? 'flex-start' : 'center')};
		flex-direction: ${({ showMobileInColumn }) => (showMobileInColumn ? 'column' : 'row')};
		background: ${({ filled, addMobileBackground, theme }) =>
			filled
				? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 300px)'
				: addMobileBackground
				? theme['color-base-surface-secondary']
				: 'transparent'};
	}

	@media (max-width: ${breakpoints.md}px) {
		justify-content: ${({ showMobileInColumn }) => (showMobileInColumn ? 'center' : 'flex-start')};
		align-items: ${({ showMobileInColumn }) => (showMobileInColumn ? 'flex-start' : 'center')};
		background: ${({ filled, addMobileBackground, theme }) =>
			filled
				? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 300px)'
				: addMobileBackground
				? theme['color-base-surface-secondary']
				: 'transparent'};
	}

	@media (max-width: ${breakpoints.sm}px) {
		background: ${({ filled, addMobileBackground, theme }) =>
			filled
				? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 300px)'
				: addMobileBackground
				? theme['color-base-surface-secondary']
				: 'transparent'};
	}
`

export const Title = styled.span`
	${TextSMMedium};
	white-space: nowrap;
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const Value = styled.span<{ filled: boolean }>`
	${HeadingXSMedium};
	white-space: nowrap;
	color: ${({ color, theme }) =>
		color === 'red' ? theme['color-base-state-error-fg'] : color === 'green' ? theme['color-base-state-success-fg'] : theme['color-base-content-top']};
	@media (max-width: ${breakpoints.lg}px) {
		${TextLGMedium};
	}
`

export const StatisticWrapper = styled.div<{ isAddress: boolean; isTxnHash: boolean }>`
	display: flex;
	flex-direction: column;
	margin-left: 16px;
	max-width: ${({ isAddress, isTxnHash }) => (isAddress ? 'calc(100% - 68px - 16px)' : isTxnHash ? 'calc(100% - 16px)' : '')};
	@media (max-width: ${breakpoints.lg}px) {
		margin-left: 0;
	}
`

export const AddressContainer = styled.div`
	white-space: nowrap;
	overflow: hidden;
`

export const FirstAddressPart = styled.span`
	max-width: calc(100% - 2.4rem);
	min-width: 2.4rem;
	display: inline-block;
	vertical-align: bottom;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	${TextXLSemibold};
	font-size: 1.125rem;
`

export const SecondAddressPart = styled.span`
	max-width: calc(100% - 2.4rem);
	direction: rtl;
	display: inline-block;
	vertical-align: bottom;
	white-space: nowrap;
	overflow: hidden;
	${TextXLSemibold};
	font-size: 1.125rem;
`

export const TxIcon = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 10px;
`
export const TxWrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
`

export const TxEllipsis = styled.div`
	${HeadingXSMedium};
	max-width: calc(100% - 24px);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	@media (max-width: ${breakpoints.lg}px) {
		${TextLGMedium};
	}
`
