import styled from 'styled-components'

import { TextSMMedium, TextXLSemibold } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const Image = styled.img<{ filled: boolean }>`
	width: ${({ filled }) => (filled ? '46px' : '40px')};
	height: ${({ filled }) => (filled ? '46px' : '71px')};
`
export const ColorWrapper = styled.div<{ filled: boolean }>`
	background: ${({ theme, filled }) => (filled ? theme['color-base-surface-secondary'] : 'transparent')};
	width: 100%;
	border-radius: 12px;
`

export const StatisticCard = styled.div<{ filled: boolean; showMobileInColumn: boolean; addMobileBackground: boolean }>`
	width: 100%;
	border-radius: 12px;
	padding: 8px;
	height: 100px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background: ${({ filled }) => (filled ? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 200px)' : 'transparent')};
	box-shadow: ${({ theme, filled }) => (filled ? theme['drop-shadow-xs'] : 'none')};
	@media (max-width: ${breakpoints.lg}px) {
		background: ${({ filled, addMobileBackground, theme }) =>
			filled
				? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 1000px)'
				: addMobileBackground
				? theme['color-base-surface-secondary']
				: 'transparent'};
		flex-direction: ${({ showMobileInColumn }) => (showMobileInColumn ? 'column' : 'row')};
	}

	@media (max-width: ${breakpoints.md}px) {
		background: ${({ filled, addMobileBackground, theme }) =>
			filled
				? 'radial-gradient(farthest-corner at bottom right, rgba(108, 120, 237, 0.5), transparent 500px)'
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

export const Value = styled.span<{ filled: boolean; color: string }>`
	${TextXLSemibold};
	white-space: nowrap;
	font-size: ${({ filled }) => (filled ? '1.125rem' : '1.3rem')};
	color: ${({ color, theme }) =>
		color === 'red' ? theme['color-base-state-error-fg'] : color === 'green' ? theme['color-base-state-success-fg'] : theme['color-base-content-top']};
`

export const StatisticWrapper = styled.div<{ isAddress: boolean }>`
	display: flex;
	flex-direction: column;
	margin-left: 16px;
	max-width: ${({ isAddress }) => (isAddress ? 'calc(100% - 68px - 16px)' : '')};
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
