import { Col, Row } from 'antd'
import styled from 'styled-components'
import { TextMDMedium } from '@/styles/typography'

export const PositionsListWrapper = styled.div`
	${TextMDMedium};
`

export const PositionListItem = styled(Row)`
	width: 100%;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	height: 140px;
	padding: 24px;
`

export const ColCenteredVertically = styled(Col)`
	display: flex;
	align-items: center;
	flex-direction: row;
`
