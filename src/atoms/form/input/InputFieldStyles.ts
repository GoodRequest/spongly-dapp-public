import styled from 'styled-components'
import { TextSMRegular } from '@/styles/typography'
import { FIELD_HEIGHT } from '@/utils/constants'

export const StyledInput = styled.div<{ error: boolean }>`
	input {
		height: ${FIELD_HEIGHT.middle};
		box-shadow: none;
		border: none;
		margin: 0;
		-webkit-appearance: none;
		background: ${({ theme }) => theme['color-base-surface-quaternary']};
		padding: 12px 20px;
		color: ${({ theme }) => theme['color-base-content-top']};
		border-radius: 10px;
		${TextSMRegular};
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

export const ErrorMessage = styled.div`
	color: ${({ theme }) => theme['color-base-state-error-bg']};
`
