import { Empty as AntdEmpty, Button, Skeleton } from 'antd'
import styled from 'styled-components'
import { HeadingXSMedium, TextMDMedium, TextMDRegular } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ContentWrapper = styled.div`
	margin-top: 32px;
`

export const Empty = styled(AntdEmpty)`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	margin: 16px 0px 16px 0px;
	border-radius: 12px;
	padding: 52px;
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

export const ShowMoreButton = styled(Button)`
	margin-top: 16px;
	height: 60px;
	background: ${({ theme }) => theme['color-base-action-secondary-default']} !important;
	border-radius: 12px;
	width: 100%;
	box-shadow: none;
	margin-bottom: 36px;
	${TextMDMedium}

	:hover:not(:disabled) {
		// must be important, or antd will ingore
		background: ${({ theme }) => theme['color-base-action-secondary-hover']} !important;
	}
	:disabled {
		border: none;
		background: ${({ theme }) => theme['color-base-action-secondary-disable']} !important;
		color: ${({ theme }) => theme['color-base-content-quaternary']} !important;
	}
`

export const ButtonContent = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

export const ButtonIcon = styled.img`
	width: 12px;
	height: 12px;
	margin-left: 12px;
`

export const RowSkeleton = styled(Skeleton)`
	margin-bottom: 16px;
	.ant-skeleton-content {
		padding: 40px 60px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		margin: 16px 0 16px 0;
		border-radius: 12px;
		h3,
		ul li {
			&::after {
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(0, 0, 0, 0.2) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
			}
		}
	}
`

export const MobileWrapper = styled.div`
	margin-bottom: 16px;
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const PCWrapper = styled.div`
	display: block;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`
