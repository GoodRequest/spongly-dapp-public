import styled from 'styled-components'
import { Col } from 'antd'
import { breakpoints } from '@/styles/theme'

export const MainContainer = styled.main`
	margin-left: auto;
	margin-right: auto;
	max-width: 1480px;

	@media (max-width: ${breakpoints.xxl}px) {
		margin-right: 60px;
		margin-left: 60px;
	}

	@media (max-width: ${breakpoints.xl}px) {
		margin-right: 24px;
		margin-left: 24px;
	}

	@media (max-width: ${breakpoints.md}px) {
		margin-right: 16px;
		margin-left: 16px;
	}
`

export const SmallMainContainer = styled.div`
	display: block;
	max-width: 977px;
	margin-bottom: 60px;
	margin-left: auto;
	margin-right: auto;
`

export const MinWidthContainer = styled.div`
	min-height: calc(100vh - 470px);
	@media (max-width: ${breakpoints.xxl}px) {
		min-height: calc(100vh - 510px);
	}

	@media (max-width: ${breakpoints.xl}px) {
		min-height: calc(100vh - 650px);
	}

	@media (max-width: ${breakpoints.md}px) {
		min-height: calc(100vh - 700px);
	}

	@media (max-width: ${breakpoints.sm}px) {
		min-height: calc(100vh - 740px);
	}

	@media (max-width: ${breakpoints.xs}px) {
		min-height: 300px;
	}
`

export const MobileHiddenCol = styled(Col)`
	display: block;
	@media (max-width: ${breakpoints.xl}px) {
		display: none;
	}
`

export const MainContentContainer = styled(Col)`
	width: 66%;

	@media (max-width: ${breakpoints.semixxl}px) {
		width: 100%;
	}
`