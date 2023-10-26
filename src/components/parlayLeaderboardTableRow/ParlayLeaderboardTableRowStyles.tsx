import { Row, Typography, Skeleton, Divider } from 'antd'
import styled from 'styled-components'
import { TextMDMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardTableRow = styled(Row)`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	padding: 16px;
	margin-bottom: 16px;
	@media (max-width: ${breakpoints.md}px) {
		// disabled gap -4px in mobile view
		margin-left: 0 !important;
		margin-right: 0 !important;
	}
`

export const RankBadge = styled.div`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	height: 52px;
	display: flex;
	max-width: 80px;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
	@media (max-width: ${breakpoints.md}px) {
		padding: 8px;
	}
`

export const BadgeIcon = styled.img`
	width: 28px;
	height: 28px;
`

export const ParlayLeaderboardTableText = styled.span`
	${TextMDMedium};
`
export const ParlayLeaderboardTableRankText = styled.span`
	${TextMDMedium};
	width: 100%;
	text-align: center;
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
		border-top: ${({ theme }) => `1px solid ${theme['color-base-surface-quintarny']}`};
		position: absolute;
		margin-top: -92px;
		z-index: 10;
	}
`

export const ColumnNameText = styled.span`
	display: none;
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	@media (max-width: ${breakpoints.md}px) {
		display: block;
		margin-bottom: 4px;
	}
`
