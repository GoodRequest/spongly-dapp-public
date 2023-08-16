import styled from 'styled-components'
import { TextMDMedium } from '../../../../styles/typography'
import worldFlag from '../../../../assets/icons/world-flag.png'

export const ScrollerChipses = styled.div<{ ref: any }>`
	display: flex;
	flex-direction: row;
	overflow: hidden;
	margin-bottom: 20px;
`

export const ScrollerChips = styled.div<{ selected?: boolean; icon?: string; hasIcon?: boolean }>`
	padding: 16px 18px;
	height: 52px;
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	border: ${({ selected, theme }) => `2px solid ${selected ? theme['color-base-action-primary-default'] : theme['color-base-surface-secondary']}`};
	&:hover {
		border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-default']}`};
	}
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	${TextMDMedium};
	font-weight: 700;
	cursor: pointer;
	border-radius: 8px;
	margin-right: 8px;
	display: flex;
	align-items: center;
	min-width: max-content;
	.flag {
		height: 20px;
		width: 20px;
		margin-right: 12px;
	}
`

export const GradientLoss = styled.div<{ direction: 'right' | 'left' }>`
	position: absolute;
	right: ${({ direction }) => (direction === 'right' ? '0px' : 'none')};
	left: ${({ direction }) => (direction === 'left' ? '0px' : 'none')};
	transform: ${({ direction }) => (direction === 'left' ? 'rotate(180deg)' : 'none')};
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
	z-index: 10;
	width: 100px;
	display: flex;
	flex-direction: row-reverse;
	background: ${({ theme }) => ` linear-gradient(270deg, ${theme['color-base-surface-top']} 53%, rgba(34, 37, 49, 0) 100%`});
	${ScrollerChips} {
		width: 42px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`

export const ImgIcon = styled.img`
	height: 24px;
	width: 24px;
`

export const ImgIconSmall = styled.div<{ icon: string }>`
	display: inline-flex;
	background: ${({ icon }) => `url(${icon})`};
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	height: 20px;
	width: 20px;
	margin-right: 12px;
`

export const FlagWorld = styled.div`
	height: 20px;
	width: 20px;
	margin-right: 12px;
	background: url(${worldFlag});
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
`
