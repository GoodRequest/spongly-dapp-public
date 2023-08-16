import { Col, Row, Typography, Skeleton, Divider } from 'antd'
import styled from 'styled-components'
import { TextMDMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardTableRow = styled(Row)`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	padding: 8px;
	height: 80px;
	margin-top: 16px;
	@media (max-width: ${breakpoints.md}px) {
		height: 160px;
	}
`

export const BadgeCol = styled(Col)`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	height: 52px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
`

export const AddressCol = styled(Col)`
	padding-left: 16px;
`

export const BadgeIcon = styled.img`
	width: 28px;
	height: 28px;
`

export const CenterRowContent = styled(Col)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`

export const CenterDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export const ParlayLeaderboardTableText = styled.span`
	${TextMDMedium}
`

export const AddressText = styled(Typography.Text)`
	${TextMDMedium}
`

export const StyledSkeleton = styled(Skeleton)`
	.ant-skeleton-paragraph {
		display: flex;
		justify-content: center;
		li {
			background: ${({ theme }) => theme['color-base-surface-secondary']} !important;
		}
	}
`

export const ParlayDivider = styled(Divider)`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
		border-top: ${({ theme }) => `1px solid ${theme['color-base-action-primary-default']}`};
		opacity: 0.5;
		position: absolute;
		margin-top: -72px;
		z-index: 10;
	}
`

export const ColumnNameText = styled.span`
	display: none;
	${TextXSMedium}
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`
