import { Col, Row } from 'antd'
import styled from 'styled-components'

import { TextMDMedium, TextXLMedium, TextXSMedium } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const FlexCenterDiv = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const ConnectWrapper = styled.div`
	display: flex;
	flex-direction: row-reverse;
	width: 100%;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const ConnectContainer = styled(FlexCenterDiv)`
	height: 52px;
	padding-left: 16px;
	padding-right: 16px;
	cursor: pointer;
	background-color: ${({ theme }) => theme['color-base-action-primary-default']};
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	border-radius: 8px;
	width: fit-content;
	transition: background-color 0.2s;

	span {
		color: ${({ theme }) => theme['color-base-content-top']};

		:hover {
			color: ${({ theme }) => theme['color-base-content-top']};
		}
	}

	:hover {
		background-color: ${({ theme }) => theme['color-base-action-primary-hover']} !important;
	}
`

export const WalletRow = styled(Row)`
	height: 52px;
	width: 100%;
	padding-left: 6px;
	padding-right: 6px;
	cursor: pointer;
	background: ${({ theme }) => theme['color-base-surface-tertiary']};
	box-shadow: ${({ theme }) => theme['drop-shadow-xs']};
	border-radius: 8px;
	align-items: center;
`

export const WalletCol = styled(Col)`
	margin-right: 6px;
`

export const Wallet = styled(FlexCenterDiv)`
	padding-right: 10px;
	width: 95px;
	text-align: center;
`

export const Info = styled.span`
	${TextMDMedium}
`
export const CurrencyCol = styled(Col)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const CurrencyInfo = styled(Info)`
	align-items: center;
	margin-left: 12px;
`

export const AddressInfo = styled.span`
	${TextXSMedium};
`

export const AddressRow = styled(Row)`
	background: ${({ theme }) => theme['color-base-surface-top']};
	border-radius: 6px;
	height: 40px;
	align-items: center;
	padding-left: 4px;
	padding-right: 4px;
	margin-right: 4px;
`
export const Logo = styled.img`
	width: 24px;
	height: 24px;
`

export const ArrowLogo = styled.img`
	width: 12px;
	height: 12px;
`

export const AccountModalButton = styled(Col)`
	display: flex;

	@media (max-width: ${breakpoints.md}px) {
		display: none;
	}
`

export const ChainOptions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const ChainRow = styled(Row)`
	padding: 12px;
	align-items: center;
	background: ${({ theme }) => theme['color-base-action-secondary-default']};
	border-radius: 8px;
	:hover {
		background: ${({ theme }) => theme['color-base-action-secondary-hover']};
	}
`

export const ChainName = styled.span`
	${TextXLMedium};
`

export const Connected = styled.span`
	${TextMDMedium};
`
