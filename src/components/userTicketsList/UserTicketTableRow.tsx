import { useTranslation } from 'next-export-i18n'
import { useAccount, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { map, round } from 'lodash'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { change, getFormValues } from 'redux-form'
import { useRouter } from 'next-translate-routes'

// components
import Button from '@/atoms/button/Button'
import TicketItem from '../ticketList/TicketItem'
import CopyTicketButton from '@/components/copyTicketButton/CopyTicketButton'

// utils
import { showNotifications } from '@/utils/tsxHelpers'
import {
	getPositionsWithMergedCombinedPositions,
	getTicketTotalQuote,
	getUserTicketClaimValue,
	getUserTicketType,
	getUserTicketTypeName,
	handleTxHashRedirect,
	isClaimableUntil,
	isWindowReady,
	orderPositionsAsSportMarkets
} from '@/utils/helpers'
import { FORM, GAS_ESTIMATION_BUFFER, MSG_TYPE, Network, NETWORK_IDS, NOTIFICATION_TYPE, OddsType, STABLE_COIN, USER_TICKET_TYPE } from '@/utils/constants'
import networkConnector from '@/utils/networkConnector'
import sportsMarketContract from '@/utils/contracts/sportsMarketContract'
import { PAGES } from '@/utils/enums'
import { roundPrice } from '@/utils/formatters/currency'

// types
import { SGPItem, UserTicket } from '@/typescript/types'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'

// hooks
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import useMultipleCollateralBalanceQuery from '@/hooks/useMultipleCollateralBalanceQuery'

import * as SC from './UserTicketTableRowStyles'

// assets
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import DocumentIcon from '@/assets/icons/document-icon.svg'

type Props = {
	ticket: UserTicket
	refetch: () => void
	isMyWallet?: boolean
}

const UserTicketTableRow = ({ ticket, isMyWallet, refetch }: Props) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const router = useRouter()
	const [expiryDate, setExpiryDate] = useState(0)
	const [isExpanded, setIsExpanded] = useState(false)
	const [isClaiming, setIsClaiming] = useState(false)
	const dispatch = useDispatch()
	const { address } = useAccount()
	const orderedPositions = orderPositionsAsSportMarkets(ticket)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const multipleCollateralBalance = useMultipleCollateralBalanceQuery(address || '', chain?.id || NETWORK_IDS.OPTIMISM)?.data
	const available = multipleCollateralBalance?.[(activeTicketValues?.selectedStablecoin as keyof typeof multipleCollateralBalance) ?? STABLE_COIN.S_USD] ?? 0
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

	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions as any, ticket, sgpFees)
	const hasOpenPositions = positionsWithMergedCombinedPositions?.some(
		// TODO: ongoing is not good because it is isOpen and isResolved at the same time
		(item) => item?.market?.isOpen && !item?.market?.isPaused && !item?.market?.isCanceled && !item?.market?.isResolved
	)
	const userTicketType = getUserTicketType(ticket)

	const isParlay = ticket?.positions?.length > 1

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
					dispatch(change(FORM.BET_TICKET, 'available', available))
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
					dispatch(change(FORM.BET_TICKET, 'available', available))
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
			<SC.TxCol md={{ span: 4, order: 1 }} xs={{ span: 24, order: 2 }}>
				<SC.TxHeader onClick={() => handleTxHashRedirect(t, ticket.txHash, chain?.id)}>
					<SC.TxIcon src={DocumentIcon} alt='hash' />
					<SC.AddressText>{ticket?.txHash}</SC.AddressText>
				</SC.TxHeader>
				<SC.ColumnNameText>{t('Txn hash')}</SC.ColumnNameText>
			</SC.TxCol>
			<SC.TagColContent md={{ span: 3, order: 2 }} xs={{ span: 24, order: 1 }}>
				<SC.TicketTypeTag ticketType={userTicketType}>{getUserTicketTypeName(userTicketType, t)}</SC.TicketTypeTag>
			</SC.TagColContent>

			<SC.CenterRowContent md={{ span: 3, order: 3 }} xs={{ span: 8, order: 3 }}>
				<>
					<SC.ColumnValueText>{roundPrice(ticket?.sUSDPaid, true, chain?.id)}</SC.ColumnValueText>
					<SC.ColumnNameText>{t('Buy-in')}</SC.ColumnNameText>
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
				<SC.ClaimValueText userTicketType={userTicketType}>{getUserTicketClaimValue(ticket, userTicketType)}</SC.ClaimValueText>
				<SC.ColumnNameText>{t('Claim')}</SC.ColumnNameText>
			</SC.CenterRowContent>
			<SC.ClaimColContent show={!!(isMyWallet && userTicketType === USER_TICKET_TYPE.SUCCESS)} md={{ span: 4, order: 5 }} xs={{ span: 24, order: 5 }}>
				<Button
					btnStyle={'primary'}
					onClick={() => handleClaim()}
					disabled={!ticket.isClaimable || isClaiming}
					size={'large'}
					loading={isClaiming}
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
			</SC.ClaimColContent>
			<SC.TicketDivider />
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
			<SC.CollapsePanel isExpanded={isExpanded} header={ticketHeader} key={ticket.id}>
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
					<Col span={24} md={12}>
						<Button
							btnStyle={'secondary'}
							content={t('Show ticket detail')}
							onClick={() => router.push(`/${PAGES.TICKET_DETAIL}/?ticketId=${ticket.id}`)}
						/>
					</Col>
					{!!(ticket.isClaimable && isMyWallet) && (
						<Col span={24} md={12}>
							<Button
								btnStyle={'primary'}
								disabled={!ticket.isClaimable}
								loading={isClaiming}
								onClick={() => handleClaim()}
								content={
									<SC.ClaimButtonWrapper>
										<SC.ClaimText>{t('Claim')}</SC.ClaimText>
										<SC.ClaimValue>{claimableUntil}</SC.ClaimValue>
									</SC.ClaimButtonWrapper>
								}
							/>
						</Col>
					)}
					{hasOpenPositions && !isMyWallet && (
						<Col span={24} md={12}>
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
