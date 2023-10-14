import { Menu as AntdMenu } from 'antd'
import styled from 'styled-components'

import { HeadingXSMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const MenuWrapper = styled.div`
	background: ${({ theme }) => theme['color-base-surface-tertiary']};
	cursor: pointer;
	height: 52px;
	width: 52px;
	padding-left: 6px;
	padding-right: 6px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	float: right;
	margin-top: -83px;
`

export const MenuLogo = styled.img`
	width: 24px;
	height: 24px;
`

export const OverlayDiv = styled.div<{ isOpen?: boolean }>`
	z-index: 25;
	position: absolute;
	background: ${({ theme }) => theme['color-base-surface-top']};
	margin-top: 40px;
	width: 100%;
	height: ${({ isOpen }) => (isOpen ? '100%' : '0px')};
	background: ${({ theme }) => theme['color-base-surface-top']};
	padding: ${({ isOpen }) => (isOpen ? '16px 16px 24px 16px' : '0')};
	left: 0px;
	top: 36px;
	box-shadow: ${({ isOpen, theme }) => (isOpen ? `inset 0px -6px 8px 2px ${theme['color-base-surface-top']}` : 'none')};
	transition: height 0.5s;
	overflow: hidden;
`
export const Wrapper = styled.div<{ isOpen?: boolean }>`
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	justify-content: space-between;
	height: calc(100% - 60px);
`

export const CenterDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`

export const Menu = styled(AntdMenu)`
	background-color: transparent;
	margin-top: 60px;
	border-inline-end: 0px !important;
`
export const MenuItem = styled(AntdMenu.Item)`
	padding-inline: 0 !important;
	height: auto !important;
	margin-bottom: 16px !important;
	padding: 8px 16px !important;
	${HeadingXSMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	&.ant-menu-item-selected {
		background: ${({ theme }) => theme['color-base-action-secondary-default']} !important;
		color: ${({ theme }) => theme['color-base-content-top']} !important;
	}
	:hover {
		color: ${({ theme }) => theme['color-base-content-top']} !important;
		background: ${({ theme }) => theme['color-base-action-secondary-default']} !important;
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

export const DisconnectWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	padding: 16px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
`
export const AddressWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 12px;
	border-radius: 12px;
	margin-bottom: 16px;
	background: ${({ theme }) => theme['color-base-surface-top']};
`
export const LogoImg = styled.img`
	width: 24px;
	height: 24px;
`
export const AddressText = styled.span`
	margin-left: 8px;
	${TextXSMedium}
`
export const ButtonWrapper = styled.div`
	display: flex;
	margin-left: 16px;
`

export const SocialMediaButton = styled.a`
	cursor: pointer;
	padding: 8px;
	&:first-of-type {
		margin-right: 16px;
	}
	img {
		width: 24px;
		height: 24px;
	}
`
