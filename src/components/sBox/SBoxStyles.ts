import styled from 'styled-components'
import { TextLGBold, TextSMMedium } from '@/styles/typography'

export const SBoxWrapper = styled.div`
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
	align-items: center;
	height: 90px;
	width: 100%;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`
export const SCColWrapper = styled.div`
	flex-direction: column;
`
export const SBoxTitle = styled.div`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-tertiary']};
`

export const SBoxValue = styled.div`
	${TextLGBold};
`
export const SBoxIcon = styled.img`
	height: 90px;
`
