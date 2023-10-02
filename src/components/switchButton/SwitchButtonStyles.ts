import styled from 'styled-components'

export const SwitchContainer = styled.div`
	display: flex;
	font-weight: 500;
	font-size: 16px;
	width: 100%;
	border-radius: 12px;
	color: white;
	background: ${({ theme }) => theme['color-base-surface-top']};
	height: 48px;
	overflow: hidden;
	margin-bottom: 40px;
`

export const Segment = styled.div<{ active: boolean }>`
	flex: 1;
	color: white;
	margin: 4px;
	display: flex;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
	cursor: ${({ active }) => (active ? 'default' : 'pointer')};
	transition: background-color 0.3s ease;
	background-color: ${(props) => (props.active ? props.theme['color-base-surface-quintarny'] : 'transparent')};
`
