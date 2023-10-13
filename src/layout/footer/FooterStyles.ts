import styled from 'styled-components'
import { TextLGMedium, TextXSRegular } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const Footer = styled.footer`
	position: relative;
	z-index: 2;
	background: ${({ theme }) => theme['color-base-surface-primary']};
	margin-top: 100px;
	bottom: 0px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 22px 60px;
	height: fit-content;

	@media (max-width: ${breakpoints.xl}px) {
		padding: 22px 60px 96px 60px;
	}

	@media (max-width: ${breakpoints.md}px) {
		padding: 22px 22px 96px 22px;
	}
`

export const FooterHead = styled.footer`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 22px;
	width: 100%;
	img {
		width: 140px;
		height: 60px;
	}
`

export const FooterLinkButton = styled.a`
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	border-radius: 12px;
	padding: 18px;
	cursor: pointer;
	&:first-of-type {
		margin-right: 16px;
	}
	img {
		width: 24px;
		height: 24px;
	}
	&:hover {
		background: ${({ theme }) => theme['color-base-action-secondary-hover']};
	}
	@media (max-width: ${breakpoints.md}px) {
		padding: 8px;
	}
`

export const TermsLink = styled.a`
	${TextXSRegular};
	color: #a8e58a;
`

export const ButtonWrapper = styled.div`
	display: flex;
`

export const CopyrightDesktop = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	${TextLGMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	span:nth-of-type(even) {
		font-size: 12px;
	}
	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const CopyrightMobile = styled.div`
	display: none;
	width: 100%;
	${TextLGMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
	margin-bottom: 22px;
	span {
		font-size: 12px;
	}
	@media (max-width: ${breakpoints.md}px) {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
`

export const FooterDivider = styled.div`
	height: 1px;
	width: 100%;
	background: ${({ theme }) => theme['color-base-surface-quintarny']};
`

export const FooterContent = styled.footer`
	padding-top: 22px;
	width: 100%;
	${TextXSRegular};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
