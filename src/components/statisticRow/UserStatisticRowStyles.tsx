import styled from 'styled-components'
import { Row } from 'antd'
import { HeadingXLRegular, TextLGMedium } from '@/styles/typography'

export const MyWalletText = styled.span`
	${TextLGMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const MyWalletValue = styled.span`
	${HeadingXLRegular};
`

export const AddressContainer = styled.div`
	white-space: nowrap;
	overflow: hidden;
`
export const FirstAddressPart = styled.span`
	max-width: calc(100% - 2.4rem);
	min-width: 2.4rem;
	display: inline-block;
	vertical-align: bottom;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	${HeadingXLRegular};
	letter-spacing: -0.3px;
	line-height: 72px;
`

export const SecondAddressPart = styled.span`
	max-width: calc(100% - 2.4rem);
	direction: rtl;
	display: inline-block;
	vertical-align: bottom;
	white-space: nowrap;
	overflow: hidden;
	${HeadingXLRegular};
	letter-spacing: -0.3px;
	line-height: 72px;
`

export const StatisticsWrapper = styled(Row)`
	height: 315px;
	border: 1px;
	padding: 40px;
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	background: ${({ theme }) => theme['color-spongly-cool-gray-700']};
`
