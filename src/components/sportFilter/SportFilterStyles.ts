import styled from 'styled-components'
import { TextMDMedium } from '@/styles/typography'

export const Filter = styled.div`
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	padding: 24px;
`
export const FilterTitle = styled.div`
	font-size: 18px;
	font-weight: 500;
	color: ${({ theme }) => theme['color-base-content-top']};
	margin-bottom: 24px;
`

export const FilterBody = styled.div`
	padding: 32px;
	border-radius: 8px;
	color: ${({ theme }) => theme['color-base-content-top']};
	background-color: ${({ theme }) => theme['color-base-surface-quaternary']};
	${TextMDMedium}
`

export const ButtonsWrapper = styled.div`
	display: flex;
	gap: 24px;
`

export const MobileFilter = styled.div`
	transition-duration: 300ms;
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background: rgba(21, 24, 52, 0.8);
`

export const MobileFilterContent = styled.div`
	margin: 20px 15px;
	padding: 24px 12px;
	background: ${({ theme }) => theme['color-base-surface-primary']};
	box-shadow: 0 24px 34px rgba(8, 9, 15, 0.2);
	border-radius: 12px;
`

export const CloseIcon = styled.img`
	width: 8px;
	height: 8px;
`

export const CloseBtn = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 100px;
	background: ${({ theme }) => theme['color-base-surface-quaternary']};
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 32px;
	right: 28px;
	cursor: pointer;
`
