import { Col, Empty as AntdEmpty } from 'antd'
import styled from 'styled-components'
import { HeadingXSMedium, TextMDRegular } from '@/styles/typography'

// placeholder for now, instead we will use sm/xs.. for smaller resolutions
export const StatisticCardCol = styled(Col)``

export const Empty = styled(AntdEmpty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 16px 16px 16px;
	border-radius: 12px;
	padding: 52px;
	width: 100%;
	.ant-empty-description {
		div {
			margin-top: 28px;
			p {
				margin-bottom: 16px;
				${HeadingXSMedium}
			}
			span {
				${TextMDRegular}
			}
		}
	}
`
