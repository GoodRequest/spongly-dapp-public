import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { map } from 'lodash'
import { Col, Row } from 'antd'

import { showNotifications } from '@/utils/tsxHelpers'
import {
	getCanceledClaimAmount,
	getEtherScanTxHash,
	getUserTicketType,
	getUserTicketTypeName,
	isClaimableUntil,
	orderPositionsAsSportMarkets,
	roundPrice
} from '@/utils/helpers'
import { USER_TICKET_TYPE, NOTIFICATION_TYPE, MSG_TYPE } from '@/utils/constants'
import networkConnector, { NetworkId } from '@/utils/networkConnector'
import { getMaxGasLimitForNetwork } from '@/utils/network'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'
import { UserTicket } from '@/typescript/types'

import Button from '@/atoms/button/Button'
import TicketItem from '../ticketList/TicketItem'

import * as SC from './UserTicketTableRowStyles'

import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'

type Props = {
	ticket: UserTicket
	refetch: () => void
}

const UserTicketTableRow = ({ ticket, refetch }: Props) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()

	const [expiryDate, setExpiryDate] = useState(0)
	const [isExpanded, setIsExpanded] = useState(false)

	const maturityDates = ticket.positions?.map((item) => {
		return { maturityDate: item?.maturityDate, id: item.marketAddress }
	})

	const lastMaturityDate = maturityDates.sort((a, b) => (a.maturityDate < b.maturityDate ? 1 : -1))[0]

	const { signer } = networkConnector
	const contract = new ethers.Contract(lastMaturityDate.id, sportsMarketContract.abi, signer)

	useEffect(() => {
		try {
			contract.times()?.then((values: any) => {
				setExpiryDate(values?.expiry?.toString())
			})
		} catch (e) {
			showNotifications(
				[{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to check claim expiry dates') }],
				NOTIFICATION_TYPE.NOTIFICATION
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const now = dayjs()
	const dateDiff = dayjs(expiryDate * 1000).diff(now, 'm')
	const claimableUntil = isClaimableUntil(dateDiff)

	const handleTxHashRedirect = (txHash: string) => {
		const link = document.createElement('a')
		const newHref = getEtherScanTxHash(chain?.id || 0, txHash)
		if (!newHref) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to redirect') }], NOTIFICATION_TYPE.NOTIFICATION)
		} else {
			link.href = newHref
			link.setAttribute('target', '_blank')
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	// positions must be ordered like sportsMarkets or marketQuotes wont fit
	const orderedPositions = orderPositionsAsSportMarkets(ticket)

	const userTicketType = getUserTicketType(ticket)

	const isClaimed = (userTicketType === USER_TICKET_TYPE.SUCCESS || userTicketType === USER_TICKET_TYPE.CANCELED) && ticket?.claimed

	const isParlay = ticket?.positions?.length > 1

	const getClaimValue = () => {
		if (userTicketType === USER_TICKET_TYPE.MISS) return `0 $`
		if (userTicketType === USER_TICKET_TYPE.SUCCESS) return `+ ${roundPrice(ticket?.amount, true)}`
		if (userTicketType === USER_TICKET_TYPE.CANCELED) return ` + ${getCanceledClaimAmount(ticket)}`
		return roundPrice(ticket?.amount, true)
	}

	const handleClaim = async () => {
		const { parlayMarketsAMMContract, signer } = networkConnector

		if (isParlay && ticket.id && signer && parlayMarketsAMMContract) {
			try {
				const parlayMarketsAMMContractWithSigner = parlayMarketsAMMContract.connect(signer)

				const tx = await parlayMarketsAMMContractWithSigner?.exerciseParlay(ticket.id, {
					gasLimit: getMaxGasLimitForNetwork(chain?.id as NetworkId)
				})
				const txResult = await tx.wait()

				if (txResult && txResult.transactionHash) {
					showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('Claimed successfully') }], NOTIFICATION_TYPE.NOTIFICATION)
					refetch()
				}
			} catch (e) {
				showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to claim') }], NOTIFICATION_TYPE.NOTIFICATION)
				// eslint-disable-next-line no-console
				console.error(e)
			}
		} else if (ticket.positions?.[0].market.address && signer) {
			const contract = new ethers.Contract(ticket.positions?.[0].market.address, sportsMarketContract.abi, signer)
			contract.connect(signer)
			try {
				const tx = await contract.exerciseOptions({
					gasLimit: getMaxGasLimitForNetwork(chain?.id as NetworkId)
				})

				const txResult = await tx.wait()

				if (txResult && txResult.transactionHash) {
					showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('Claimed successfully') }], NOTIFICATION_TYPE.NOTIFICATION)
					refetch()
				}
			} catch (e) {
				showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to claim') }], NOTIFICATION_TYPE.NOTIFICATION)
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
	}

	const ticketHeader = (
		<SC.UserTicketTableRow show={ticket.isClaimable} align={'middle'} gutter={[16, 16]} onClick={() => console.log(ticket)}>
			<SC.TxCol md={{ span: 6, order: 1 }} xs={{ span: 24, order: 2 }}>
				<Button
					btnStyle={'secondary'}
					disabled={!(chain?.id && ticket.txHash)}
					onClick={() => handleTxHashRedirect(ticket.txHash)}
					content={<SC.TxButtonText>{ticket?.txHash}</SC.TxButtonText>}
				/>
				<SC.CenterDiv>
					<SC.ColumnNameText>{t('Tx hash')}</SC.ColumnNameText>
				</SC.CenterDiv>
			</SC.TxCol>
			<SC.TagColContent md={{ span: 4, order: 2 }} xs={{ span: 24, order: 1 }}>
				<SC.TicketTypeTag ticketType={userTicketType}>{getUserTicketTypeName(userTicketType, t)}</SC.TicketTypeTag>
			</SC.TagColContent>

			<SC.CenterRowContent md={{ span: 3, order: 3 }} xs={{ span: 12, order: 3 }}>
				<>
					<SC.ColumnValueText>{roundPrice(ticket?.sUSDPaid, true)}</SC.ColumnValueText>
					<SC.ColumnNameText>{t('Buy in')}</SC.ColumnNameText>
				</>
			</SC.CenterRowContent>

			<SC.CenterRowContent md={{ span: 5, order: 4 }} xs={{ span: 12, order: 4 }}>
				{isClaimed ? (
					<SC.ClaimValueText userTicketType={userTicketType}>{t('Claimed')}</SC.ClaimValueText>
				) : (
					<>
						<SC.ClaimValueText userTicketType={userTicketType}>{getClaimValue()}</SC.ClaimValueText>
						<SC.ColumnNameText>{t('Claim')}</SC.ColumnNameText>
					</>
				)}
			</SC.CenterRowContent>
			<SC.ClaimColContent show={ticket.isClaimable} md={{ span: 4, order: 5 }} xs={{ span: 24, order: 5 }}>
				<Button
					btnStyle={'primary'}
					onClick={() => handleClaim()}
					content={
						<SC.ClaimButtonWrapper>
							<SC.ClaimText>{t('Claim')}</SC.ClaimText>
							<SC.ClaimValue>{claimableUntil}</SC.ClaimValue>
						</SC.ClaimButtonWrapper>
					}
				/>
			</SC.ClaimColContent>
			<SC.TicketDivider showClaimed={ticket.isClaimable} />
		</SC.UserTicketTableRow>
	)

	return (
		<SC.UserCollapse
			collapsible={'icon'}
			expandIconPosition={'end'}
			key={ticket.id}
			onChange={() => setIsExpanded(!isExpanded)}
			activeKey={isExpanded ? [ticket.id] : []}
			isExpanded={isExpanded}
		>
			<SC.ColapsePanel header={ticketHeader} key={ticket.id}>
				<Row gutter={[16, 16]}>
					{map(orderedPositions, (item, index) => (
						<Col key={item?.id} xxl={12} span={24}>
							<TicketItem
								match={item as any}
								oddsInfo={{ quote: Number(ticket?.marketQuotes?.[index]), isParlay: ticket.positions.length > 1 }}
							/>
						</Col>
					))}
				</Row>
			</SC.ColapsePanel>
			<SC.CollapseButtonWrapper>
				<Button
					type={'primary'}
					btnStyle={'secondary'}
					onClick={() => setIsExpanded(!isExpanded)}
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}
					content={<SC.ButtonIcon src={ArrowDownIcon} style={isExpanded ? { transform: 'rotate(180deg)' } : {}} />}
				/>
			</SC.CollapseButtonWrapper>
		</SC.UserCollapse>
	)
}

export default UserTicketTableRow
