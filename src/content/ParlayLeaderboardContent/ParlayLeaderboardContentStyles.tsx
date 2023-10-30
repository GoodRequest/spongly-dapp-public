import { Col, Row, Skeleton } from 'antd'
import styled from 'styled-components'

import { TextMDMedium, TextLGRegular, TextLGMedium, HeadingXXSMedium, HeadingXLMedium, HeadingMDMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardTextCol = styled(Col)`
	display: flex;
	flex-direction: column;
`

export const FilterWrapper = styled.div`
	max-width: 375px;
	&.search {
		float: right;
		width: 100%;
		@media (max-width: ${breakpoints.md}px) {
			margin-top: 8px;
		}
	}
	@media (max-width: ${breakpoints.md}px) {
		max-width: unset;
	}
`

export const PeriodDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 16px;
	margin-bottom: 16px;
`

export const WarningIcon = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 12px;
`

export const ButtonIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const ParlayLeaderboardFilterRow = styled(Row)`
	margin-top: 48px;
`

export const ParlayLeaderboardTitle = styled.span`
	${HeadingXLMedium};
	margin-bottom: 24px;

	@media (max-width: ${breakpoints.md}px) {
		${HeadingMDMedium};
		margin-bottom: 12px;
	}
`

export const ParlayLeaderboardList = styled.ul`
	${TextLGRegular};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	list-style-type: disc;
`

export const ParlayLeaderboardContext = styled.span`
	${TextLGRegular};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	margin-top: 16px;
`

export const ParlayleaderboardText = styled.span`
	${TextLGMedium};
	margin-top: 16px;
`

export const PeriodSubtext = styled.span`
	${TextMDMedium}
`

export const YourPositionText = styled.p`
	${HeadingXXSMedium}
`

export const ParlayLeaderboardTableText = styled.p`
	margin-top: 32px;
	display: none;
	${HeadingXXSMedium};
	@media (max-width: ${breakpoints.md}px) {
		display: block;
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
