import { Col, Row } from 'antd'
import styled from 'styled-components'
import { TextMDMedium, TextXLMedium, TextXSRegular } from '@/styles/typography'
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
	text-align: center;
`
export const Img = styled.img`
	width: 48px;
	height: 48px;
`

export const MediumSpan = styled.span`
	${TextMDMedium};
`

export const SmallSpan = styled.span`
	${TextXSRegular};
`

export const MediumSpanGreen = styled(MediumSpan)`
	color: ${({ theme }) => theme['color-base-state-success-fg']};
`

export const MediumSpanGrey = styled.span`
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`

export const BetOption = styled.div`
	border-radius: 6px;
	border: ${({ theme }) => `2px solid ${theme['color-base-action-primary-default']}`};
	background: ${({ theme }) => theme['color-base-state-info-bg']};
	display: flex;
	align-items: center;
	justify-content: center;
	height: 32px;
	min-width: 52px;
	padding: 8px;
`

export const VSSpan = styled.span<{ status: MATCH_STATUS }>`
	${TextXLMedium}
	color: ${({ theme, status }) =>
		status === MATCH_STATUS.SUCCESS
			? theme['color-base-state-success-fg']
			: status === MATCH_STATUS.MISS
			? theme['color-base-state-error-fg']
			: theme['color-base-content-quaternary']};
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
	align-items: center;
`

export const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding-left: 32px;
	padding-right: 32px;
`
