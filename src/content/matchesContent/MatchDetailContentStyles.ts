import styled from 'styled-components'
import { Col, Skeleton } from 'antd'
import { breakpoints } from '@/styles/theme'
import { HeadingXSMedium, TextMDSemibold, TextXSMedium } from '@/styles/typography'

export const MatchDetailWrapper = styled.div`
	width: 100%;
	margin: 40px 15px 15px 15px;
	padding: 24px;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`
export const MatchDetailHeader = styled.div`
	margin-bottom: 30px;
`
export const HeaderTeam = styled.div`
	margin-top: 16px;
	${HeadingXSMedium};
	text-align: center;
	height: 84px;
	@media (max-width: ${breakpoints.md}px) {
		${TextMDSemibold};
		margin-top: 8px;
		height: auto;
	}
`
export const HeaderVersusText = styled.div`
	${HeadingXSMedium};
	text-align: center;
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	@media (max-width: ${breakpoints.md}px) {
		${TextMDSemibold};
		color: ${({ theme }) => theme['color-base-content-quaternary']};
	}
`
export const HeaderStatus = styled.div`
	${TextXSMedium};
	padding: 12px;
	text-align: center;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border-radius: 6px;
	@media (max-width: ${breakpoints.md}px) {
		margin-bottom: 16px;
	}
`

export const MatchIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	@media (max-width: ${breakpoints.md}px) {
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		border-radius: 999px;
	}
	&:last-of-type {
		margin-left: -14px;
	}
	&:first-of-type {
		margin-left: 0;
	}
	img {
		padding: 4px;
		width: 120px;
		height: 120px;
		@media (max-width: ${breakpoints.md}px) {
			height: 48px;
			width: 48px;
		}
	}
`

export const HeaderCol = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	@media (max-width: ${breakpoints.md}px) {
		justify-content: flex-start;
	}
`
export const FlagWrapper = styled.div`
	width: 80px;
	@media (max-width: ${breakpoints.md}px) {
		width: 40px;
	}
`
export const RowSkeleton = styled(Skeleton)`
	margin-top: 40px;
	.ant-skeleton-content {
		padding: 24px;
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
