import styled from 'styled-components'

export const SettigsWrapper = styled.div`
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
`

export const SettingsLogo = styled.img`
	width: 24px;
	height: 24px;
`
