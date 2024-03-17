import styled from 'styled-components'
import { Col, Row, Typography } from 'antd'

import { TextSMMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardTableRow = styled(Row)`
	border-radius: 8px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	padding: 8px;
	height: 60px;
	margin-top: 11px;
`

export const BadgeCol = styled(Col)`
	border-radius: 6px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;

	@media (max-width: ${breakpoints.xl}px) {
		display: none;
	}
`

export const RankCol = styled(Col)`
	display: none;

	@media (max-width: ${breakpoints.xl}px) {
		border-radius: 6px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

export const AddressCol = styled(Col)`
	padding-left: 16px;

	@media (max-width: ${breakpoints.semixxl}px) {
		padding-left: 4px;
	}

	@media (max-width: ${breakpoints.xl}px) {
		padding-left: 8px;
	}
`

export const BadgeIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const ParlayLeaderboardTableText = styled.span`
	${TextSMMedium}
`

export const AddressText = styled(Typography.Text)`
	${TextSMMedium}
`

export const NoWrapDiv = styled.div`
	white-space: nowrap;
`

export const NetworkIcon = styled.img`
	width: 16px;
	height: 16px;
`
