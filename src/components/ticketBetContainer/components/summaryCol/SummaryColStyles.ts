import styled from 'styled-components'
import { TextMDMedium } from '@/styles/typography'

export const SummaryColTitle = styled.span`
	${TextMDMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const SummaryColValue = styled.span`
	${TextMDMedium};
	color: ${({ theme }) => theme['color-base-content-top']};
	.ant-spin-nested-loading {
		display: inline-block !important;
	}
`
