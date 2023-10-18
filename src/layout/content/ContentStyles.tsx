import styled, { css } from 'styled-components'
import { Col, Row, Skeleton } from 'antd'
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

export const StatsWrapper = styled.div`
	width: 100%;
	overflow: hidden;
	margin-bottom: 40px;
	@media (max-width: ${breakpoints.md}px) {
		overflow: auto;
	}
`

export const StatsOverlayWrapper = styled(Row)`
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	.ant-col:not(:last-child) {
		padding-right: 16px;
	}
	@media (max-width: ${breakpoints.xl}px) and (min-width: ${breakpoints.md}px) {
		.ant-col {
			padding-right: 0 !important;
			&:nth-child(1),
			&:nth-child(2) {
				padding-bottom: 16px;
			}
			&:nth-child(1),
			&:nth-child(3) {
				padding-right: 16px !important;
			}
		}
	}
	@media (max-width: ${breakpoints.md}px) {
		justify-content: space-between;
		cursor: grab;
		min-width: 1200px;
	}
`
export const SmallMainContainer = styled.div`
	display: block;
	max-width: 977px;
	margin-bottom: 60px;
	margin-left: auto;
	margin-right: auto;
`

export const MinWidthContainer = styled.div`
	min-height: calc(100vh - 470px);
	@media (max-width: ${breakpoints.xxl}px) {
		min-height: calc(100vh - 510px);
	}

	@media (max-width: ${breakpoints.xl}px) {
		min-height: calc(100vh - 650px);
	}

	@media (max-width: ${breakpoints.md}px) {
		min-height: calc(100vh - 700px);
	}

	@media (max-width: ${breakpoints.sm}px) {
		min-height: calc(100vh - 740px);
	}

	@media (max-width: ${breakpoints.xs}px) {
		min-height: 300px;
	}
`

export const MobileHiddenCol = styled(Col)`
	display: block;
	@media (max-width: ${breakpoints.xl}px) {
		display: none;
	}
`

export const MainContentContainer = styled(Col)`
	width: 66%;

	@media (max-width: ${breakpoints.semixxl}px) {
		width: 100%;
	}
`

export const RowSkeleton = styled(Skeleton)`
	margin-bottom: 16px;
	.ant-skeleton-content {
		padding: 10px 40px;
		height: 80px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		margin: 16px 0 16px 0;
		border-radius: 12px;
		h3,
		ul li {
			&::after {
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(0, 0, 0, 0.2) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
			}
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
	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`
