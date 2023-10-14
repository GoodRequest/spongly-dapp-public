import styled from 'styled-components'
import Link from 'next/link'
import { Col, Row, Menu as AntdMenu, Divider as AntdDivider } from 'antd'

import { TextLGMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const HeadRow = styled(Row)`
	padding-top: 16px;
	margin-bottom: 24px;
	height: 84px;
	background: ${({ theme }) => theme['color-base-surface-top']};

	@media (max-width: ${breakpoints.md}px) {
		margin-right: 64px;
	}
`

export const HeaderLink = styled(Link)<{ isSelected?: boolean }>`
	${TextLGMedium};
	color: ${({ isSelected, theme }) => (isSelected ? theme['color-base-content-top'] : theme['color-base-content-quaternary'])};

	:hover {
		color: ${({ theme }) => theme['color-base-content-top']};
	}
`

export const LinkWrapper = styled.div`
	width: 100%;
	display: flex;
	max-width: 600px;
	justify-content: space-between;
`

export const LinkCol = styled(Col)`
	margin-right: 50px;
	margin-left: 40px;
`

export const Menu = styled(AntdMenu)`
	background-color: transparent;
	&.ant-menu-horizontal {
		border-bottom: 0px !important;
	}
`

export const MenuItem = styled(AntdMenu.Item)`
	${TextLGMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	&.ant-menu-item-selected {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
		border-bottom: 0px !important;
	}
	:hover {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}
	::after {
		border-bottom-width: 0px !important;
	}
	&.ant-menu-item-disabled {
		cursor: none;
		color: #60626c !important;
		:hover {
			color: #60626c !important;
		}
	}
`
export const Divider = styled(AntdDivider)`
	border-top: ${({ theme }) => `1px solid ${theme['color-base-action-secondary-default']}`};
`

export const MenuXLRow = styled(Row)`
	margin-left: -16px;
	padding-top: 0px;
	margin-bottom: 16px;
`

export const WalletDiv = styled.div`
	display: flex;
	flex-direction: row;
	gap: 16px;
`

export const XXLWrapper = styled.div`
	display: block;
	@media (max-width: ${breakpoints.semixxl}px) {
		display: none;
	}
`

export const XLWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.semixxl}px) {
		display: block;
	}

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const MobileWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`
export const SettingButton = styled.div`
	height: 52px;
	width: 52px;
	padding-left: 6px;
	padding-right: 6px;
	display: flex;
	cursor: pointer;
	background: ${({ theme }) => theme['color-base-surface-tertiary']};
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	//
	//background: red;
	//border-radius: 8px;
	//height: 52px;
	//width: 52px;
	//// padding: 18px;
	//// cursor: pointer;
	//// &:first-of-type {
	//// 	margin-right: 16px;
	//// }
	img {
		width: 24px;
		height: 24px;
	}
	// &:hover {
	// 	background: ${({ theme }) => theme['color-base-action-secondary-hover']};
	// }
	// @media (max-width: ${breakpoints.md}px) {
	// 	padding: 8px;
	// }
`
