import styled from 'styled-components'
import { Input } from 'antd'
import { TextLGMedium } from '@/styles/typography'

export const Search = styled(Input)`
	border: none;
	width: 100%;
	height: 60px;
	${TextLGMedium};

	.ant-input {
		color: ${({ theme }) => theme['color-base-content-top']};

		&::placeholder {
			color: ${({ theme }) => theme['color-base-content-quaternary']} !important;
		}
	}

	.anticon {
		color: ${({ theme }) => theme['color-base-content-top']};
	}
`
