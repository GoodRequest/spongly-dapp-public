import styled, { keyframes } from 'styled-components'
import { Col } from 'antd'
import { HeadingSMMedium, HeadingXSMedium, TextMDMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ModalDescription = styled(Col)`
	${TextMDMedium};
	text-align: center;
	margin-bottom: 32px;
	color: ${({ theme }) => theme['color-base-content-tertiary']};
`
const flicker = keyframes`
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
`

export const ModalDescriptionWarning = styled(Col)`
	${TextMDMedium};
	text-align: center;
	margin-bottom: 32px;
	animation: ${flicker} 1s infinite;
	color: ${({ theme }) => theme['color-base-state-warning-fg']};
`
export const ModalTitle = styled(Col)`
	${HeadingSMMedium};
	width: 75%;
	margin: 0 auto;
	text-align: center;
	margin-bottom: 12px;

	@media (max-width: ${breakpoints.md}px) {
		${HeadingXSMedium}
	}
`
export const MatchContainerRow = styled(Col)`
	max-height: 304px;
	margin-bottom: 32px;
	overflow: auto;
	background: linear-gradient(360deg, #1d2046 0%, rgba(29, 32, 70, 0) 100%);
`
