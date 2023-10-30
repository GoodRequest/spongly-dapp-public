import styled from 'styled-components'
import { Row, Skeleton } from 'antd'
import { breakpoints } from '@/styles/theme'

export const StatsWrapper = styled.div<{ hide?: boolean }>`
	width: 100%;
	display: ${({ hide }) => (hide ? 'none' : 'block')};
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
export const Glow = styled.div<{ $color: string }>`
	position: absolute;
	width: 112px;
	height: 110px;
	right: 0;
	top: -55px;
	background-color: ${({ $color }) => $color};
	filter: blur(40px);
`
