import styled from 'styled-components'
import { TextMDMedium } from '@/styles/typography'

export const CategoryItems = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20px;
`

export const CategoryItem = styled.div<{ selected?: boolean; icon?: string; hasIcon?: boolean }>`
	padding: 16px 18px;
	height: 52px;
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	border: ${({ selected, theme }) => `2px solid ${selected ? theme['color-base-action-primary-default'] : theme['color-base-surface-secondary']}`};
	&:hover {
		border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-default']}`};
	}
	background: ${({ selected, theme }) => `${selected ? theme['color-base-state-info-bg'] : theme['color-base-surface-secondary']}`};
	font-weight: 700;
	cursor: pointer;
	border-radius: 8px;
	margin-right: 12px;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	min-width: max-content;
	${TextMDMedium}
	.flag {
		height: 20px;
		width: 20px;
		margin-right: 12px;
	}
`

export const CategoryTitle = styled.div`
	color: ${({ theme }) => theme['color-base-content-top']};
	margin-bottom: 12px;
	${TextMDMedium}
`
