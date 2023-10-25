import styled from 'styled-components'
import { TextSMRegular } from '@/styles/typography'
import { FIELD_HEIGHT } from '@/utils/constants'

export const LoaginOverlay = styled.div<{ show: boolean }>`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
`

export const StyledInput = styled.div`
	span {
		span {
			height: ${FIELD_HEIGHT.small};
		}
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		border: none;
		height: ${FIELD_HEIGHT.middle};
		box-shadow: none;
		border: none;
		-webkit-appearance: none;
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		border-radius: 10px;
		${TextSMRegular};
	}
	input {
		color: white;
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		&.ant-input-sm {
			border-radius: 8px;
			height: ${FIELD_HEIGHT.small};
		}
		&.ant-input-lg {
			border-radius: 12px;
			height: ${FIELD_HEIGHT.large};
		}
		&::placeholder {
			${TextSMRegular};
			color: ${({ theme }) => theme['color-base-content-quaternary']};
		}
		&:focus {
			box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
		}
	}
`
