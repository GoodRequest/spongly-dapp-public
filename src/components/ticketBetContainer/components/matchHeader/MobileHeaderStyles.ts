import styled from 'styled-components'
import { Row, Col, Button } from 'antd'
import { Select } from '@/atoms/select/SelectStyles'
import { TextMDBold } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const MobileHeaderRow = styled(Row)<{ $rolledUp: boolean }>`
	width: 100%;
	display: flex;
	transition: all 0.5ms;
	margin-bottom: ${({ $rolledUp }) => ($rolledUp ? '16px' : '0px')};
	align-items: center;
	${Select} {
		max-width: 150px;
		.ant-select-selector {
			height: 40px !important;
		}
		.ant-select-selection-item {
			font-weight: 600;
		}
	}
	@media (min-width: ${breakpoints.semixxl}px) {
		display: none;
	}
`

export const ShiftedCol = styled(Col)`
	padding-left: 8px;
`

export const HeaderLabel = styled.label`
	${TextMDBold};
	color: ${({ theme }) => theme['color-base-content-quaternary']};
`
export const HeaderValue = styled.div`
	${TextMDBold};
	color: ${({ theme }) => theme['color-base-content-top']};
`

export const DropButtonColWrapper = styled(Col)`
	display: flex;
	justify-content: flex-end;
`

export const DropButton = styled(Button)<{ $rolledUp: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	width: 40px;
	transform: ${({ $rolledUp }) => ($rolledUp ? 'rotate(0deg)' : 'rotate(180deg)')};
	background-color: ${({ theme }) => theme['color-base-action-secondary-default']};
	&:hover {
		background-color: ${({ theme }) => theme['color-base-action-primary-default']};
	}
	border: none;
`
