import styled from 'styled-components'
import { TextSMMedium } from '@/styles/typography'

export const SummaryColTitle = styled.span`
	${TextSMMedium};
	margin-right: 4px;
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const SummaryColValue = styled.span<{ isProfit?: boolean }>`
	${TextSMMedium};
	font-weight: ${({ isProfit }) => (isProfit ? '700' : '500')};
	color: ${({ theme, isProfit }) => (isProfit ? theme['color-base-state-success-fg'] : theme['color-base-content-top'])};
	.ant-spin-nested-loading {
		display: inline-block !important;
	}
`
