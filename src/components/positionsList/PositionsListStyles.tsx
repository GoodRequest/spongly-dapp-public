import { Col, Row } from 'antd'
import styled from 'styled-components'
import { TextMDMedium, TextXLMedium } from '@/styles/typography'
import { MATCH_STATUS } from '@/utils/constants'

export const PositionsListWrapper = styled.div`
	${TextMDMedium};
`

export const PositionListItem = styled(Row)`
	width: 100%;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	height: 140px;
	padding: 24px;
	margin-bottom: 16px;
`

export const ColCenteredVertically = styled(Col)`
	display: flex;
	align-items: center;
	flex-direction: row;
`

export const TeamCol = styled(Col)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`
export const Img = styled.img`
	width: 48px;
	height: 48px;
`

export const MediumSpan = styled.span`
	${TextMDMedium};
`

export const MediumSpanGreen = styled(MediumSpan)`
	color: ${({ theme }) => theme['color-base-state-success-fg']};
`

export const MediumSpanGrey = styled.span`
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const VSSpan = styled.span`
	${TextXLMedium}
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const BlackBox = styled.div`
	margin: 16px;
	border-radius: 12px;
	width: 100%;
	height: 100%;
	background: ${({ theme }) => theme['color-base-surface-primary']};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

export const OddsWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-evenly;
	margin-top: 12px;
`
export const State = styled.div<{ status: MATCH_STATUS }>``
