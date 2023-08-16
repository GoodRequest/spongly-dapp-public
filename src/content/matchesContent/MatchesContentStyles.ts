import styled from 'styled-components'
import { Skeleton } from 'antd'
import { HeadingXSMedium, TextXSMedium } from '@/styles/typography'
import { FlagWorld } from '@/styles/GlobalStyles'
import { breakpoints } from '@/styles/theme'

export const LeagueWrapper = styled.div``

export const LeagueHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	${HeadingXSMedium}

	${FlagWorld} {
		width: 28px;
	}
`

export const ListHeader = styled.div`
	gap: 12px;

	.ant-radio-group {
		width: calc(100% - 60px);
	}

	display: flex;
	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const FilterBtn = styled.div`
	width: 60px;
	height: 60px;
	color: white;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	:hover {
		color: ${({ theme }) => theme['color-base-content-top']};
		background: ${({ theme }) => theme['color-base-surface-quintarny']};
	}
`

export const FilterCount = styled.div`
	position: absolute;
	z-index: 9;
	width: 24px;
	height: 24px;
	top: -8px;
	right: 8px;
	background: ${({ theme }) => theme['color-base-action-primary-default']};
	border-radius: 40px;
	text-align: center;
	span {
		color: ${({ theme }) => theme['color-base-content-top']};
		font-size: 16px;
		line-height: 24px;
	}
`

export const FilterIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const ContentTitle = styled.div`
	color: ${({ theme }) => theme['color-base-content-top']};
	${TextXSMedium};
	font-weight: 500;
	font-size: 28px;
	line-height: 32px;
`

export const MobileSelectionHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
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
