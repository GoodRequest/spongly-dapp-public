import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { map } from 'lodash'
import { Col, Row, Spin } from 'antd'

// components
import Button from '@/atoms/button/Button'
import TicketItem from '../ticketList/TicketItem'
import CopyTicketButton from '@/components/copyTicketButton/CopyTicketButton'

// utils
import { showNotifications } from '@/utils/tsxHelpers'
import {
	getCanceledClaimAmount,
	getEtherScanTxHash,
	getPositionsWithMergedCombinedPositions,
	getTicketTotalQuote,
	getUserTicketType,
	getUserTicketTypeName,
	isClaimableUntil,
	isWindowReady,
	orderPositionsAsSportMarkets
} from '@/utils/helpers'
import { GAS_ESTIMATION_BUFFER, MSG_TYPE, Network, NETWORK_IDS, NOTIFICATION_TYPE, OddsType, USER_TICKET_TYPE } from '@/utils/constants'
import networkConnector from '@/utils/networkConnector'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'
import { roundPrice } from '@/utils/formatters/currency'

// types
import { SGPItem, UserTicket } from '@/typescript/types'

// hooks
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'

import * as SC from './UserTicketTableRowStyles'

// assets
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import DocumentIcon from '@/assets/icons/document-icon.svg'

type Props = {
	ticket: UserTicket
	refetch: () => void
	isMyWallet?: boolean
}

const UserTicketTableRow = ({ ticket, refetch, isMyWallet }: Props) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const [expiryDate, setExpiryDate] = useState(0)
	const [isExpanded, setIsExpanded] = useState(false)
	const [isClaiming, setIsClaiming] = useState(false)
	const orderedPositions = orderPositionsAsSportMarkets(ticket)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

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
	const claimableUntil = !!(ticket.isClaimable && isMyWallet) && isClaimableUntil(dateDiff)

	const handleTxHashRedirect = (txHash: string) => {
		const link = document.createElement('a')
		const newHref = getEtherScanTxHash(chain?.id || NETWORK_IDS.OPTIMISM, txHash)
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

	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticket, sgpFees)
	const hasOpenPositions = positionsWithMergedCombinedPositions?.some(
		// TODO: ongoing is not good because it is isOpen and isResolved at the same time
		(item) => item?.market?.isOpen && !item?.market?.isPaused && !item?.market?.isCanceled && !item?.market?.isResolved
	)
	const userTicketType = getUserTicketType(ticket)

	const isParlay = ticket?.positions?.length > 1

	const getClaimValue = () => {
		if (userTicketType === USER_TICKET_TYPE.MISS) return `0 $`
		if (userTicketType === USER_TICKET_TYPE.SUCCESS) return `+ ${roundPrice(ticket?.amount, true)}`
		if (userTicketType === USER_TICKET_TYPE.CANCELED) return ` + ${getCanceledClaimAmount(ticket)}`
		return roundPrice(ticket?.amount, true)
	}

	const handleClaim = async () => {
		const { parlayMarketsAMMContract, signer } = networkConnector
		setIsClaiming(true)

		if (isParlay && ticket.id && signer && parlayMarketsAMMContract) {
			try {
				const parlayMarketsAMMContractWithSigner = parlayMarketsAMMContract.connect(signer)

				const estimationGas = await parlayMarketsAMMContractWithSigner?.estimateGas.exerciseParlay(ticket.id)
				const finalEstimationGas = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

				const tx = await parlayMarketsAMMContractWithSigner?.exerciseParlay(ticket.id, {
					gasLimit: chain?.id ? finalEstimationGas : undefined
				})
				const txResult = await tx.wait()

				if (txResult && txResult.transactionHash) {
					showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('Claimed successfully') }], NOTIFICATION_TYPE.NOTIFICATION)
					refetch()
				}
			} catch (e) {
				const err: any = e
				if (err?.code === 'ACTION_REJECTED') {
					showNotifications([{ type: MSG_TYPE.INFO, message: t('User rejected transaction') }], NOTIFICATION_TYPE.NOTIFICATION)
				} else {
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to claim') }], NOTIFICATION_TYPE.NOTIFICATION)
				}
				// eslint-disable-next-line no-console
				console.error(e)
			}
		} else if (ticket.positions?.[0].market.address && signer) {
			const contract = new ethers.Contract(ticket.positions?.[0].market.address, sportsMarketContract.abi, signer)
			contract.connect(signer)

			const estimationGas = await contract?.estimateGas.exerciseOptions({})
			const finalEstimationGas = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

			try {
				const tx = await contract.exerciseOptions({
					gasLimit: chain?.id ? finalEstimationGas : undefined
				})

				const txResult = await tx.wait()

				if (txResult && txResult.transactionHash) {
					showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('Claimed successfully') }], NOTIFICATION_TYPE.NOTIFICATION)
					refetch()
				}
			} catch (e) {
				const err: any = e
				if (err?.code === 'ACTION_REJECTED') {
					showNotifications([{ type: MSG_TYPE.INFO, message: t('User rejected transaction') }], NOTIFICATION_TYPE.NOTIFICATION)
				} else {
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to claim') }], NOTIFICATION_TYPE.NOTIFICATION)
				}
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
		setIsClaiming(false)
	}

	const ticketHeader = (
		<SC.UserTicketTableRow show={ticket.isClaimable} align={'middle'} gutter={[16, 16]}>
			<SC.TxCol md={{ span: 3, order: 1 }} xs={{ span: 24, order: 2 }}>
				<SC.TxHeader onClick={() => handleTxHashRedirect(ticket.txHash)}>
					<SC.TxIcon src={DocumentIcon} alt='hash' />
					<SC.AddressText>{ticket?.txHash}</SC.AddressText>
				</SC.TxHeader>
				<SC.ColumnNameText>{t('Tx hash')}</SC.ColumnNameText>
			</SC.TxCol>
			<SC.TagColContent md={{ span: 4, order: 2 }} xs={{ span: 24, order: 1 }}>
				<SC.TicketTypeTag ticketType={userTicketType}>{getUserTicketTypeName(userTicketType, t)}</SC.TicketTypeTag>
			</SC.TagColContent>

			<SC.CenterRowContent md={{ span: 3, order: 3 }} xs={{ span: 8, order: 3 }}>
				<>
					<SC.ColumnValueText>{roundPrice(ticket?.sUSDPaid, true)}</SC.ColumnValueText>
					<SC.ColumnNameText>{t('Buy in')}</SC.ColumnNameText>
				</>
			</SC.CenterRowContent>
			<SC.CenterRowContent md={{ span: 3, order: 3 }} xs={{ span: 8, order: 3 }}>
				<>
					<SC.ColumnValueText>
						{Number(getTicketTotalQuote(ticket as any, actualOddType, 'positions' in ticket ? ticket.quote : undefined)).toFixed(2)}
					</SC.ColumnValueText>
					<SC.ColumnNameText>{t('Quote')}</SC.ColumnNameText>
				</>
			</SC.CenterRowContent>
			<SC.CenterRowContent md={{ span: 5, order: 4 }} xs={{ span: 8, order: 4 }}>
				<SC.ClaimValueText userTicketType={userTicketType}>{getClaimValue()}</SC.ClaimValueText>
				<SC.ColumnNameText>{t('Claim')}</SC.ColumnNameText>
			</SC.CenterRowContent>
			<SC.ClaimColContent show={!!(isMyWallet && userTicketType === USER_TICKET_TYPE.SUCCESS)} md={{ span: 4, order: 5 }} xs={{ span: 24, order: 5 }}>
				{!isClaiming ? (
					<Button
						btnStyle={'primary'}
						onClick={() => handleClaim()}
						disabled={!ticket.isClaimable}
						size={'large'}
						content={
							!ticket.isClaimable ? (
								t('Claimed')
							) : (
								<SC.ClaimButtonWrapper>
									<SC.ClaimText>{t('Claim')}</SC.ClaimText>
									<SC.ClaimValue>{claimableUntil}</SC.ClaimValue>
								</SC.ClaimButtonWrapper>
							)
						}
					/>
				) : (
					<Spin />
				)}
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
			<SC.CollapsePanel header={ticketHeader} key={ticket.id}>
				<Row gutter={[16, 16]}>
					{map(positionsWithMergedCombinedPositions, (item, index) => (
						<Col key={item?.id} span={24} lg={12}>
							<TicketItem
								match={item as any}
								oddsInfo={{
									quote: item?.isCombined ? item?.odds : Number(ticket?.marketQuotes?.[index]),
									isParlay: ticket.positions.length > 1,
									isCombined: item?.isCombined,
									combinedPositionsText: item?.combinedPositionsText
								}}
							/>
						</Col>
					))}
				</Row>
				<SC.StylesRow gutter={[16, 16]}>
					{/* <Col span={12}> */}
					{/*	<Button */}
					{/*		btnStyle={'secondary'} */}
					{/*		content={t('Show ticket detail')} */}
					{/*		onClick={() => { */}
					{/*			// TODO: redirect to detail */}
					{/*		}} */}
					{/*	/> */}
					{/* </Col> */}
					{!!(ticket.isClaimable && isMyWallet) && (
						<Col span={12} xs={24}>
							{!isClaiming ? (
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
							) : (
								<Spin />
							)}
						</Col>
					)}
					{hasOpenPositions && !isMyWallet && (
						<Col md={12} span={24}>
							<CopyTicketButton ticket={ticket} />
						</Col>
					)}
				</SC.StylesRow>
			</SC.CollapsePanel>
			<SC.CollapseButtonWrapper>
				<Button
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
