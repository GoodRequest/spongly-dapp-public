import { Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import styled from 'styled-components'

import { HeadingSMMedium } from '@/styles/typography'

export const BackButtonWrapper = styled.div`
	height: 52px;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
`

export const BackButton = styled(Button)`
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']} !important;
	border-radius: 8px;
	border: none;
	background: ${({ theme }) => theme['color-base-surface-tertiary']};
	width: 52px !important;
	height: 52px;

	:hover {
		// NOTE: must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-surface-quintarny']} !important;
	}
`

export const BackButtonIcon = styled(LeftOutlined)`
	color: ${({ theme }) => theme['color-base-content-top']};
`

export const BackButtonText = styled.span`
	margin-left: 24px;
	${HeadingSMMedium};
`
