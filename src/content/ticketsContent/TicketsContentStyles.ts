import styled from 'styled-components'
import { TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const ListHeader = styled.div`
	gap: 12px;
	margin-bottom: 16px;
	.ant-form {
		width: 100%;
	}

	.ant-form-item {
		margin-bottom: 0;
	}

	display: flex;
	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const FilterBtn = styled.div`
	width: 60px;
	height: 60px;
	color: white;
	border-radius: 12px;
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	:hover {
		color: ${({ theme }) => theme['color-base-content-top']};
		background: ${({ theme }) => theme['color-base-surface-quintarny']};
	}
`

export const FilterCount = styled.div`
	position: absolute;
	z-index: 9;
	width: 24px;
	height: 24px;
	top: -8px;
	right: 8px;
	background: ${({ theme }) => theme['color-base-action-primary-default']};
	border-radius: 40px;
	text-align: center;
	span {
		color: ${({ theme }) => theme['color-base-content-top']};
		font-size: 16px;
		line-height: 24px;
	}
`

export const FilterIcon = styled.img`
	width: 20px;
	height: 20px;
`

export const ContentTitle = styled.div`
	color: ${({ theme }) => theme['color-base-content-top']};
	${TextXSMedium};
	font-weight: 500;
	font-size: 28px;
	line-height: 32px;
`

export const MobileSelectionHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
`

export const MobileWrapper = styled.div`
	display: none;

	@media (max-width: ${breakpoints.md}px) {
		display: block;
	}
`

export const PCWrapper = styled.div`
	display: flex;
	width: 100%;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`
