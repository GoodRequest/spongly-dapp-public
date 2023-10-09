import { Divider, Row, Skeleton } from 'antd'
import styled from 'styled-components'
import { TextSMMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const LeaderboardContentWrapper = styled.div`
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
		padding-left: 16px;
		padding-right: 16px;
	}
`
export const LeaderboardContentRow = styled(Row)`
	padding: 24px;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin-bottom: 16px;
`

export const WalletIcon = styled.div<{ imageSrc: number }>`
	height: 48px;
	width: 48px;
	margin-right: 16px;
	border-radius: 50%;
	background: url(${({ imageSrc }) => imageSrc});
	background-size: 75%;
	background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	background-repeat: no-repeat;
	background-position: center;
`
export const Wallet = styled.div`
	display: flex;
`
export const Description = styled.span`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const Value = styled.span`
	@media (max-width: ${breakpoints.md}px) {
		order: 2;
	}
`

export const Title = styled.span`
	${TextSMMedium};
	display: flex;
	flex-direction: column;
	justify-content: center;
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

export const LeaderboardDivider = styled(Divider)`
	display: none;
	margin-left: -24px;
	width: calc(100% + 24px + 24px);
	margin-top: 0;
	margin-bottom: 0;
	@media (max-width: ${breakpoints.md}px) {
		display: block;
		border-top: ${({ theme }) => `1px solid ${theme['color-base-action-secondary-default']}`};
		z-index: 10;
	}
`
export const ButtonContent = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

export const ButtonIcon = styled.img`
	margin-left: 8px;
	width: 16px;
	height: 16px;
`