import styled from 'styled-components'
import { Skeleton } from 'antd'
import { TextLGRegular, TextSMRegular, TextXLBold } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'
import { FIELD_HEIGHT } from '@/utils/constants'

export const LayoutWrapper = styled.div`
	background: ${({ theme }) => theme['color-base-surface-top']};
	min-height: 100vh;
`

export const PanelHeader = styled.div`
	display: inline-flex;
	align-items: center;
`

export const FlagWrapper = styled.div`
	width: 28px;
	margin-right: 12px;
`

export const ErrorStateNoData = styled.div`
	h3 {
		${TextXLBold}
	}
	p {
		${TextLGRegular}
	}
	padding: 24px;
	margin-top: 8px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 16px;
	margin-bottom: 32px;
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

export const OverlayLoading = styled.div`
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
	${TextXLBold}
`

export const Logo = styled.img`
	width: 300px;
	height: 120px;
	margin-bottom: 4px;
`

export const MobileTicketBetWrapper = styled.div`
	display: none;
	position: fixed;
	top: 0;
	z-index: 10;
	@media (max-width: ${breakpoints.xl}px) {
		display: flex;
	}
`

export const LoadingWrapper = styled.div`
	display: flex;
`

export const SpinnerWrapper = styled.div`
	display: inline-flex;
	margin-right: 16px !important;
`
export const LoadingOverlay = styled.div<{ show: boolean }>`
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
