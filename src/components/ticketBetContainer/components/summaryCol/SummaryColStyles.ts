import styled from 'styled-components'
import { TextMDMedium } from '@/styles/typography'

export const SummaryColTitle = styled.span`
	${TextMDMedium};
	margin-right: 4px;
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const SummaryColValue = styled.span<{ isProfit?: boolean }>`
	${TextMDMedium};
	font-weight: ${({ isProfit }) => (isProfit ? '700' : '500')};
	color: ${({ theme, isProfit }) => (isProfit ? theme['color-base-state-success-fg'] : theme['color-base-content-top'])};
	.ant-spin-nested-loading {
		display: inline-block !important;
	}
`
