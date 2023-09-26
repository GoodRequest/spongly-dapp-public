import styled from 'styled-components'
import { breakpoints } from '@/styles/theme'

export const Logo = styled.img`
	width: 163px;
	height: 70px;
	margin-right: 40px;
	cursor: pointer;
	@media (max-width: ${breakpoints.sm}px) {
		margin-right: 0px;
	}
`
