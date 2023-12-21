import styled from 'styled-components'
import { Col, Row } from 'antd'
import { HeadingXLRegular, HeadingXSRegular, TextLGMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const MyWalletText = styled.span`
	${TextLGMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};

	@media (max-width: ${breakpoints.md}px) {
		${TextXSMedium};
		color: ${({ theme }) => theme['color-base-content-quaternary']};
	}
`

export const WalletImageWrapper = styled(Col)`
	display: flex;
	flex-direction: row-reverse;
	align-items: center;

	@media (max-width: ${breakpoints.lg}px) {
		position: absolute;
		right: 32px;
		top: 32px;
	}
`

export const WalletIcon = styled.div<{ imageSrc: number }>`
	// TODO: od peta vadsi image
	height: 180px;
	width: 180px;
	border-radius: 50%;
	background: url(${({ imageSrc }) => imageSrc});
	background-size: 75%;
	background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	background-repeat: no-repeat;
	background-position: center;

	@media (max-width: ${breakpoints.lg}px) {
		height: 60px;
		width: 60px;
	}
`

export const ValuesContainer = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

export const AddressContainer = styled.div`
	white-space: nowrap;
	overflow: hidden;
	max-width: 450px;
`
export const FirstAddressPart = styled.span`
	max-width: calc(100% - 8rem);
	min-width: 2.4rem;
	display: inline-block;
	vertical-align: bottom;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	${HeadingXLRegular};
	letter-spacing: -0.3px;
	line-height: 72px;

	@media (max-width: ${breakpoints.md}px) {
		${HeadingXSRegular};
		line-height: 32px;
	}
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

	@media (max-width: ${breakpoints.md}px) {
		${HeadingXSRegular};
		line-height: 32px;
	}
`

export const StatisticsWrapper = styled(Row)`
	height: 315px;
	border: 1px;
	padding: 40px;
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	background: ${({ theme }) => theme['color-spongly-cool-gray-700']};

	@media (max-width: ${breakpoints.md}px) {
		padding: 20px;
		height: 275px;
	}
`
