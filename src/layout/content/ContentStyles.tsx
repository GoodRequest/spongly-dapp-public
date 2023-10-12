import styled from 'styled-components'
import { Col, Skeleton } from 'antd'
import { breakpoints } from '@/styles/theme'

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
export const StatsOverlayWrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	@media (max-width: ${breakpoints.lg}px) {
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
