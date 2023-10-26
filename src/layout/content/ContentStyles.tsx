import styled, { css } from 'styled-components'
import { Col } from 'antd'
import { breakpoints } from '@/styles/theme'
import { WALLET_TICKETS } from '@/utils/enums'

export const MainContainer = styled.main`
	margin-left: auto;
	margin-right: auto;
	max-width: 1480px;

	@media (max-width: ${breakpoints.xxl}px) {
		margin-right: 60px;
		margin-left: 60px;
	}

	@media (max-width: ${breakpoints.xl}px) {
		margin-right: 24px;
		margin-left: 24px;
	}

	@media (max-width: ${breakpoints.md}px) {
		margin-right: 16px;
		margin-left: 16px;
	}
`

export const SmallMainContainer = styled.div`
	display: block;
	max-width: 977px;
	margin-bottom: 60px;
	margin-left: auto;
	margin-right: auto;
`
export const FullWidthContentCol = styled(Col)`
	width: 100%;
	color: ${({ theme }) => theme['color-base-content-top']};
	padding-left: 16%;
	padding-right: 16%;

	@media (max-width: ${breakpoints.xl}px) {
		padding-left: 12%;
		padding-right: 12%;
	}
	@media (max-width: ${breakpoints.lg}px) {
		padding-left: 6%;
		padding-right: 6%;
	}
	@media (max-width: ${breakpoints.md}px) {
		padding-left: 0;
		padding-right: 0;
	}
`
export const MinWidthContainer = styled.div<{ footerHeight: number }>`
	// Header (70px + 16px + 16px = 102px) + Footer (246px + 100px = 348px) = 450px
	min-height: calc(100vh - (102px + ${({ footerHeight }) => footerHeight}px + 100px));
	// // Header (165px + 16px = 181px ) + Footer + 100px
	@media (max-width: ${breakpoints.semixxl}px) {
		min-height: calc(100vh - (181px + ${({ footerHeight }) => footerHeight}px + 100px));
	}
	@media (max-width: ${breakpoints.md}px) {
		min-height: calc(100vh - (102px + ${({ footerHeight }) => footerHeight}px + 100px));
	}
`

export const MobileHiddenCol = styled(Col)`
	display: block;
	@media (max-width: ${breakpoints.xl}px) {
		display: none;
	}
`

export const MainContentContainer = styled(Col)<{ withPadding: boolean }>`
	width: 66%;

	@media (min-width: ${breakpoints.semixxl}px) {
		padding-right: ${({ withPadding }) => (withPadding ? '32px' : '0')};
	}

	@media (max-width: ${breakpoints.semixxl}px) {
		width: 100%;
	}
`

export const Status = styled.div<{ visible: boolean; status?: WALLET_TICKETS }>`
	display: ${({ visible }) => (visible ? 'block' : 'none')};
	position: fixed;
	right: -400px;
	top: 250px;
	width: 545px;
	height: 721px;
	border-radius: 721px;
	background: #6c78ed;
	filter: blur(175px);
	${(p) =>
		p.status === WALLET_TICKETS.SUCCESSFUL &&
		css`
			background: #aaff99; // TODO: add tokens from figma because not exist in figma
		`}
	${(p) =>
		(p.status === WALLET_TICKETS.MISSED || p.status === WALLET_TICKETS.PAUSED_CANCELED) &&
		css`
			background: #ff6759;
		`};
	${(p) =>
		p.status === WALLET_TICKETS.ONGOING &&
		css`
			background: #ff8833;
		`};
	@media (max-width: ${breakpoints.semixxl}px) {
		display: none;
	}
`
