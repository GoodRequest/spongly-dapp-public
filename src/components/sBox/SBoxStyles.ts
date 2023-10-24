import styled from 'styled-components'
import { TextLGBold, TextSMMedium } from '@/styles/typography'

export const SBoxWrapper = styled.div`
	position: relative;
	overflow: hidden;
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
	align-items: center;
	justify-content: space-between;
	height: 80px;
	width: 100%;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
`
export const SBoxColWrapper = styled.div`
	flex-direction: column;
`
export const SBoxTitle = styled.div`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-tertiary']};
`

export const SBoxValue = styled.div`
	${TextLGBold};
`
export const SBoxExtraContent = styled.div`
	pointer-events: none;
	button {
		pointer-events: all;
	}
`
