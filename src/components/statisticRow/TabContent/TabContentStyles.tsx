import { Col, Row } from 'antd'
import styled from 'styled-components'
import { HeadingXSSemibold, TextSMMedium, TextXSMedium, TextLGMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const TabsRow = styled(Row)`
	margin-left: -16px;
`

export const Wrapper = styled.div`
	display: flex;
	height: 100%;
	flex-direction: column;
	gap: 0;

	@media (min-width: ${breakpoints.md}px) {
		flex-direction: row;
		gap: 8px;
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
	${TextLGMedium};

	@media (min-width: ${breakpoints.md}px) {
		${HeadingXSSemibold};
	}
`

export const ValueTitle = styled.span`
	${TextXSMedium};
	color: ${({ theme }) => theme['color-base-content-quaternary']};

	@media (min-width: ${breakpoints.md}px) {
		${TextSMMedium};
		color: ${({ theme }) => theme['color-base-content-quaternary']};
	}
`
