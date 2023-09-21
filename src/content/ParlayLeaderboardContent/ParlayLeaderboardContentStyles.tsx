import { Button, Col, Row, Empty as AntdEmpty } from 'antd'
import styled from 'styled-components'

import {
	TextMDMedium,
	TextLGRegular,
	TextLGMedium,
	HeadingXSMedium,
	TextMDRegular,
	HeadingXXSMedium,
	HeadingXLMedium,
	HeadingMDMedium
} from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ParlayLeaderboardTextCol = styled(Col)`
	display: flex;
	flex-direction: column;
`

export const ContentWrapper = styled.div`
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

export const CenterRowContent = styled(Col)`
	display: flex;
	justify-content: center;
`

export const WarningIcon = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 12px;
`

export const OrderButton = styled(Button)`
	background: transparent;
	border: none;
	box-shadow: none;
	${TextMDMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};

	:hover:not(.no-sorting) {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-surface-quaternary']}!important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}

	&.active {
		background: ${({ theme }) => theme['color-base-surface-quaternary']} !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}

	:disabled {
		color: ${({ theme }) => theme['color-base-content-quaternary']} !important;
	}
`

export const FilterRow = styled(Row)`
	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const ShowMoreButton = styled(Button)`
	margin-top: 16px;
	height: 60px;
	background: ${({ theme }) => theme['color-inverse-action-primary-default']};
	border-radius: 12px;
	width: 100%;
	box-shadow: none;
	margin-bottom: 36px;
	${TextMDMedium}

	:hover:not(:disabled) {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-inverse-action-primary-hover']} !important;
	}

	:disabled {
		border: none;
		background: ${({ theme }) => theme['color-base-action-primary-disable']};
		color: ${({ theme }) => theme['color-base-content-primary']};
	}
`

export const ButtonContent = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

export const ButtonIcon = styled.img`
	margin-right: 0 !important;
	margin-left: 4px;
	width: 16px;
	height: 16px;
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

export const Empty = styled(AntdEmpty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 0px 16px 0px;
	border-radius: 12px;
	padding: 52px;
	.ant-empty-description {
		div {
			margin-top: 28px;
			p {
				margin-bottom: 16px;
				${HeadingXSMedium}
			}
			span {
				${TextMDRegular}
			}
		}
	}
`

export const PCRow = styled(Row)`
	display: flex;

	@media (max-width: ${breakpoints.xl}px) {
		display: none;
	}
`
