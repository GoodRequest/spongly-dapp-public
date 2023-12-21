import { Col } from 'antd'
import styled from 'styled-components'
import { HeadingXSSemibold, TextSMMedium, TextXSMedium, TextLGMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	gap: 8px;

	@media (max-width: ${breakpoints.md}px) {
		flex-direction: column;
		gap: 0;
	}
`

export const IconWrapper = styled.div`
	width: 56px;
	padding: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const RightSideWrapper = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: start;
`

export const ValueText = styled.span`
	${HeadingXSSemibold};

	@media (max-width: ${breakpoints.md}px) {
		${TextLGMedium};
	}
`

export const ValueTitle = styled.span`
	${TextSMMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};

	@media (max-width: ${breakpoints.md}px) {
		${TextXSMedium};
		color: ${({ theme }) => theme['color-base-content-quaternary']};
	}
`
