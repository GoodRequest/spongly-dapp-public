import { change, getFormValues, initialize } from 'redux-form'
import { ethers } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useNetwork } from 'wagmi'
import { useTranslation } from 'next-export-i18n'
import { find, round, toNumber } from 'lodash'
import { Col, Row, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Modal from '@/components/modal/Modal'

// hooks
import useParlayAmmDataQuery from '@/hooks/useParlayAmmDataQuery'
import useMultipleCollateralBalanceQuery from '@/hooks/useMultipleCollateralBalanceQuery'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useMedia } from '@/hooks/useMedia'
import useAvailablePerPositionQuery from '@/hooks/useAvailablePerPositionQuery'

// utils
import { BET_OPTIONS, DoubleChanceMarketType, FORM, RESOLUTIONS } from '@/utils/enums'
import { sportsMarketContract } from '@/utils/contracts/sportsMarketContract'
import {
	ADDITIONAL_SLIPPAGE,
	GAS_ESTIMATION_BUFFER,
	MAX_ALLOWANCE,
	MAX_BUY_IN,
	MIN_BUY_IN,
	MSG_TYPE,
	NETWORK_IDS,
	NOTIFICATION_TYPE,
	OddsType,
	PositionNumber,
	REFERRER_WALLET,
	STABLE_COIN,
	ZERO_ADDRESS
} from '@/utils/constants'
import networkConnector from '@/utils/networkConnector'
import { getParlayMarketsAMMQuoteMethod } from '@/utils/parlayAmm'
import { floorNumberToDecimals, roundNumberToDecimals } from '@/utils/formatters/number'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import {
	getBetOptionAndAddressFromMatch,
	getBetOptionFromMatchBetOption,
	getOddByBetType,
	getSelectedCoinIndex,
	getStablecoinDecimals,
	isBellowOrEqualResolution,
	isCombined,
	updateUnsubmittedTicketMatches
} from '@/utils/helpers'
import { getSportsAMMQuoteMethod } from '@/utils/amm'
import { fetchAmountOfTokensForXsUSDAmount } from '@/utils/skewCalculator'
import { getMatchByBetOption, getOddsPropertyFromBetOption, isMarketAvailable } from '@/utils/markets'
import { showNotifications } from '@/utils/tsxHelpers'
import { formatCurrency } from '@/utils/formatters/currency'
import { formatQuote } from '@/utils/formatters/quote'

// atoms
import Button from '@/atoms/button/Button'

// components
import HorizontalScroller from './components/horizontalScroller/HorizontalScroller'
import TicketBetContainerForm from './TicketBetContainerForm'
import MobileHeader from './components/matchHeader/MobileHeader'

// redux
import { RootState } from '@/redux/rootReducer'
import {
	ACTIVE_TICKET_APPROVING,
	ACTIVE_TICKET_SUBMITTING,
	IUnsubmittedBetTicket,
	TicketPosition,
	UNSUBMITTED_BET_TICKETS
} from '@/redux/betTickets/betTicketTypes'
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'

// styles
import * as SC from './TicketBetContainerStyles'
import { breakpoints } from '@/styles/theme'
import MatchRow from './components/matchRow/MatchRow'

const TicketBetContainer = () => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { address } = useAccount()
	const [rolledUp, setRolledUp] = useState(false)
	const multipleCollateralBalance = useMultipleCollateralBalanceQuery(address || '', chain?.id || NETWORK_IDS.OPTIMISM)?.data
	const isMounted = useIsMounted()
	const [isSwitchedTicket, setIsSwitchedTicket] = useState(false)
	const size = useMedia()
	const [deleteModal, setDeleteModal] = useState({ visible: false, id: 0 })
	const isProcessing = useSelector((state: RootState) => state.betTickets.isProcessing)

	const [availablePerPosition, setAvailablePerPosition] = useState<any>({
		[PositionNumber.HOME]: {
			available: 0
		},
		[PositionNumber.AWAY]: {
			available: 0
		},
		[PositionNumber.DRAW]: {
			available: 0
		}
	})

	const isSubmitting = useSelector((state: RootState) => state.betTickets.isSubmitting)
	const isApproving = useSelector((state: RootState) => state.betTickets.isApproving)

	const [activeTicketID, setActiveTicketID] = useState<number>(1)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const activeTicketMatchesCount = activeTicketValues?.matches?.length || 0
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const parlayAmmDataQuery = useParlayAmmDataQuery(chain?.id || NETWORK_IDS.OPTIMISM)
	const available = multipleCollateralBalance?.[(activeTicketValues?.selectedStablecoin as keyof typeof multipleCollateralBalance) ?? STABLE_COIN.S_USD] ?? 0

	const availablePerPositionQuery = useAvailablePerPositionQuery(getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0], {
		enabled: activeTicketValues?.matches?.length === 1
	})

	useEffect(() => {
		if (availablePerPositionQuery.isSuccess && availablePerPositionQuery.data) {
			setAvailablePerPosition(availablePerPositionQuery.data)
		}
	}, [availablePerPositionQuery.isSuccess, availablePerPositionQuery.data])

	const isWalletConnected = isMounted && address && chain

	const parlayAmmData = useMemo(() => {
		if (parlayAmmDataQuery.isSuccess && parlayAmmDataQuery.data) {
			return parlayAmmDataQuery.data
		}
		return undefined
	}, [parlayAmmDataQuery.isSuccess, parlayAmmDataQuery.data])

	const handleSetActiveTicket = async (ticket: IUnsubmittedBetTicket) => {
		dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE, payload: { data: unsubmittedTickets } })
		setActiveTicketID(ticket.id || 1)
		setIsSwitchedTicket(true)
	}

	const handleRemoveTicket = (id: number) => {
		// NOTE: If there is only one ticket, we need to reset it and set UNSUBMITTED_BET_TICKETS and BET_TICKET matches to empty array (after submit ticket)
		if (unsubmittedTickets && unsubmittedTickets.length === 1) {
			dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_INIT, payload: { data: [{ id: 1, matches: [], copied: false }] } })
			dispatch(change(FORM.BET_TICKET, 'matches', []))
			setActiveTicketID(1)
		} else {
			// Otherwise we need to remove whole ticket from list
			const data = unsubmittedTickets && unsubmittedTickets.filter((ticket) => Number(ticket.id) !== id)
			dispatch({
				type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
				payload: { data }
			})
			if (activeTicketValues.id === id || data?.length === 1) {
				// NOTE: If selected ticket will be removed, we need to set active ticket to first ticket in list
				setActiveTicketID(data?.[0].id || 1)
			}
		}
		// TODO: scroll to first item (if remove 10th ticket then select 1st ticket but need to be also scrolled left)
	}

	useEffect(() => {
		if (!unsubmittedTickets || unsubmittedTickets?.length === 0) {
			dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_INIT, payload: { data: [{ id: 1, matches: [], copied: false }] } })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!activeTicketID && unsubmittedTickets && unsubmittedTickets?.length > 0) handleSetActiveTicket(unsubmittedTickets[0])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unsubmittedTickets])

	useEffect(() => {
		const newActiveTicket = unsubmittedTickets?.find((item) => item.id === activeTicketID)

		// Filters out matches that are not available
		const availableMatches = newActiveTicket?.matches?.filter((match) => isMarketAvailable(match))
		dispatch(
			initialize(FORM.BET_TICKET, {
				...newActiveTicket,
				matches: availableMatches || [],
				allowance: 0,
				selectedStablecoin: newActiveTicket?.selectedStablecoin ?? STABLE_COIN.S_USD,
				available:
					multipleCollateralBalance?.[(newActiveTicket?.selectedStablecoin as keyof typeof multipleCollateralBalance) ?? STABLE_COIN.S_USD] ?? 0,
				totalQuote: 0,
				maxTotalQuote: parlayAmmData?.maxSupportedOdds,
				maxBuyIn: parlayAmmData?.maxSupportedAmount || MAX_BUY_IN,
				minBuyIn: parlayAmmData?.minUsdAmount || MIN_BUY_IN,
				totalBonus: 0,
				payout: 0,
				buyIn: newActiveTicket?.buyIn || parlayAmmData?.minUsdAmount || MIN_BUY_IN,
				potentionalProfit: 0,
				fees: {
					parlay: parlayAmmData?.parlayAmmFee ? parlayAmmData.parlayAmmFee * 100 : '-',
					safebox: parlayAmmData?.safeBoxImpact ? parlayAmmData.safeBoxImpact * 100 : '-',
					skew: 0
				}
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTicketID, parlayAmmData])

	const fetchParlayAmmQuote = useCallback(
		async (susdAmountForQuote: number) => {
			const { parlayMarketsAMMContract } = networkConnector
			if (parlayMarketsAMMContract && parlayAmmData?.minUsdAmount) {
				const marketsAddresses = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses
				const betOptions = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).betTypes
				const minUsdAmount =
					susdAmountForQuote < parlayAmmData?.minUsdAmount
						? parlayAmmData?.minUsdAmount // deafult value for qoute info
						: susdAmountForQuote
				const susdPaid = ethers.utils.parseUnits(roundNumberToDecimals(minUsdAmount).toString())
				try {
					const parlayAmmQuote = await getParlayMarketsAMMQuoteMethod(
						getSelectedCoinIndex(activeTicketValues.selectedStablecoin),
						chain?.id || NETWORK_IDS.OPTIMISM,
						parlayMarketsAMMContract,
						marketsAddresses,
						betOptions,
						susdPaid
					)
					return parlayAmmQuote
				} catch (e: any) {
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while ParlayAmmQuote fetch') }], NOTIFICATION_TYPE.NOTIFICATION)
					const errorMessage = e?.reason
					if (errorMessage) {
						if (errorMessage.includes('RiskPerComb')) {
							// TODO: handle Risk per combination exceeded error
							return { error: 'RiskPerComb' }
						}
					}
					// eslint-disable-next-line no-console
					console.error(e)
					return { error: errorMessage }
				}
			}
			return undefined
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[chain?.id, activeTicketValues?.selectedStablecoin, activeTicketValues?.matches, activeTicketValues?.buyIn]
	)

	const fetchSinglesAmmQuote = useCallback(
		async (susdAmountForQuote: number) => {
			const { sportsAMMContract } = networkConnector
			if (activeTicketValues?.matches?.length === 1) {
				if (sportsAMMContract && parlayAmmData?.minUsdAmount && susdAmountForQuote) {
					const parsedAmount = ethers.utils.parseEther(roundNumberToDecimals(susdAmountForQuote).toString())

					const marketAddress = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0]
					const selectBetOption = getBetOptionFromMatchBetOption(activeTicketValues?.matches[0].betOption)

					try {
						const sportsAmmQuote = await getSportsAMMQuoteMethod(
							getSelectedCoinIndex(activeTicketValues.selectedStablecoin),
							chain?.id || NETWORK_IDS.OPTIMISM,
							sportsAMMContract,
							marketAddress,
							selectBetOption,
							parsedAmount
						)
						return sportsAmmQuote
					} catch (err) {
						showNotifications(
							[{ type: MSG_TYPE.ERROR, message: t('An error occurred while SingleAMMQuote fetch') }],
							NOTIFICATION_TYPE.NOTIFICATION
						)
						throw new Error('An error occurred while SingleAMMQuote fetch', { cause: err })
					}
				}
			}
			return undefined
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[chain?.id, activeTicketValues?.selectedStablecoin, activeTicketValues?.matches, activeTicketValues?.buyIn]
	)

	const getAllowance = async () => {
		const { signer, sUSDContract, parlayMarketsAMMContract, sportsAMMContract } = networkConnector
		try {
			if (signer && sUSDContract && isWalletConnected) {
				const sUSDContractWithSigner = sUSDContract?.connect(signer)
				// TODO: Add logic when user switch coin type
				let allowance = BigInt(0)
				if (activeTicketMatchesCount === 0) {
					allowance = BigInt(0)
				} else if (activeTicketMatchesCount === 1 && !isCombined(activeTicketValues?.matches?.[0].betOption)) {
					allowance = await sUSDContractWithSigner.allowance(address, sportsAMMContract?.address)
				} else if (activeTicketMatchesCount > 1 || isCombined(activeTicketValues?.matches?.[0].betOption)) {
					allowance = await sUSDContractWithSigner.allowance(address, parlayMarketsAMMContract?.address)
				}
				return Number(ethers.utils.formatEther(allowance))
			}
			return 0
		} catch (e) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while getting the allowance') }], NOTIFICATION_TYPE.NOTIFICATION)
			return 0
		}
	}

	const fetchParleyTicketData = async () => {
		if (!activeTicketValues?.buyIn || Number(activeTicketValues?.buyIn) < MIN_BUY_IN)
			return { ...activeTicketValues, totalQuote: 0, payout: 0, skew: 0, potentionalProfit: 0, totalBonus: 0 }

		try {
			// const parlayAmmMinimumUSDAmountQuote = parlayAmmData?.minUsdAmount ? await fetchParlayAmmQuote(parlayAmmData?.minUsdAmount) : 0
			const parlayAmmQuote = await fetchParlayAmmQuote(activeTicketValues?.buyIn)
			if (!parlayAmmQuote?.error) {
				const totalQuote = bigNumberFormatter(parlayAmmQuote?.totalQuote ?? 0)
				const totalBuyAmount = bigNumberFormatter(parlayAmmQuote?.totalBuyAmount ?? 0)
				const payout = parlayAmmData?.minUsdAmount && activeTicketValues?.buyIn >= parlayAmmData?.minUsdAmount ? formatCurrency(totalBuyAmount, 2) : '-'
				const potentionalProfit =
					parlayAmmData?.minUsdAmount && activeTicketValues?.buyIn >= parlayAmmData?.minUsdAmount
						? formatCurrency(totalBuyAmount - toNumber(activeTicketValues.buyIn), 2)
						: null
				const skew = bigNumberFormatter(parlayAmmQuote?.skewImpact || 0)
				// TODO: Do we need this logic? Remove this logic if testing bonuses will be correct
				// const totalBonus = '0'
				// console.log('parlayAmmMinimumUSDAmountQuote', parlayAmmMinimumUSDAmountQuote)
				// Calculates total bonus percentage
				// if (!parlayAmmMinimumUSDAmountQuote.error) {
				// 	const baseQuote = bigNumberFormatter(parlayAmmMinimumUSDAmountQuote?.totalQuote ?? 0)
				// 	const calculatedReducedTotalBonus =
				// 		(calculatedBonusPercentageDec * Number(formatQuote(OddsType.DECIMAL, totalQuote))) / Number(formatQuote(OddsType.DECIMAL, baseQuote))
				// 	totalBonus = calculatedReducedTotalBonus > 0 ? formatPercentage(calculatedReducedTotalBonus) : formatPercentage(0)
				// }

				const calculatedBonusPercentageDec =
					(activeTicketValues?.matches || []).reduce((accumulator, currentItem) => {
						const bonusDecimal = getOddByBetType(currentItem as any, false).rawBonus / 100 + 1
						return accumulator * bonusDecimal
					}, 1) - 1

				const totalBonus = calculatedBonusPercentageDec ? round(calculatedBonusPercentageDec * 100, 2).toFixed(2) : null
				return {
					...activeTicketValues,
					totalQuote: formatQuote(OddsType.DECIMAL, totalQuote),
					totalBonus,
					payout,
					skew,
					potentionalProfit
				}
			}
			return { ...activeTicketValues, totalQuote: 0, payout: 0, skew: 0, potentionalProfit: 0 }
		} catch (err) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('Something happened while processing the ticket') }], NOTIFICATION_TYPE.NOTIFICATION)
			throw new Error('Failed to fetch parley ticket data', { cause: err })
		}
	}

	const fetchSinglesTicketData = async () => {
		try {
			const { signer, sportsAMMContract } = networkConnector
			const divider = Number(`1e${getStablecoinDecimals(chain?.id || NETWORK_IDS.OPTIMISM, getSelectedCoinIndex(activeTicketValues.selectedStablecoin))}`)
			if (!activeTicketValues?.buyIn || Number(activeTicketValues.buyIn) < MIN_BUY_IN || activeTicketValues?.matches?.length === 0 || !signer)
				return { ...activeTicketValues, totalQuote: 0, payout: 0, skew: 0, potentionalProfit: 0, totalBonus: 0 }
			const currentAddress = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0]
			const contract = new ethers.Contract(currentAddress || '', sportsMarketContract.abi, signer)
			const ammBalances = await contract.balancesOf(sportsAMMContract?.address)
			const ammBalanceForSelectedPosition = ammBalances[getBetOptionAndAddressFromMatch(activeTicketValues.matches).betTypes[0]]
			const roundedMaxAmount = floorNumberToDecimals(
				availablePerPosition[getBetOptionFromMatchBetOption(activeTicketValues?.matches?.[0].betOption as any)].available || 0
			)
			const singlesAmmMaximumUSDAmountQuote = await fetchSinglesAmmQuote(roundedMaxAmount)
			const singlesAmmQuote = await fetchSinglesAmmQuote(activeTicketValues?.buyIn)
			if (singlesAmmQuote !== null) {
				const amountOfTokens =
					fetchAmountOfTokensForXsUSDAmount(
						Number(activeTicketValues?.buyIn),
						getOddByBetType(activeTicketValues?.matches?.[0] as any, activeTicketValues.copied || false).rawOdd as any,
						singlesAmmMaximumUSDAmountQuote / divider,
						availablePerPosition[getBetOptionFromMatchBetOption(activeTicketValues?.matches?.[0].betOption as any)].available || 0,
						bigNumberFormatter(ammBalanceForSelectedPosition)
					) || 0
				const flooredAmountOfTokens = floorNumberToDecimals(amountOfTokens)
				const parsedQuote = singlesAmmQuote / divider
				const recalculatedTokenAmount = roundNumberToDecimals((amountOfTokens * Number(activeTicketValues?.buyIn)) / parsedQuote)

				const maxAvailableTokenAmount = recalculatedTokenAmount > flooredAmountOfTokens ? flooredAmountOfTokens : recalculatedTokenAmount
				const payout = roundNumberToDecimals(maxAvailableTokenAmount ?? 0)
				const potentionalProfit = Number(maxAvailableTokenAmount) - Number(activeTicketValues.buyIn)
				const skew = 0
				// TODO: calculate number from bonus?
				const totalBonus = getOddByBetType(activeTicketValues?.matches?.[0] as any, false).rawBonus
					? round(Number(getOddByBetType(activeTicketValues?.matches?.[0] as any, false).rawBonus), 2).toFixed(2)
					: null
				const getOdds = () => {
					const selectedMatch = getMatchByBetOption(
						activeTicketValues?.matches?.[0]?.betOption as BET_OPTIONS.WINNER_HOME,
						activeTicketValues?.matches?.[0] as TicketPosition
					)

					if (selectedMatch) {
						if (selectedMatch?.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW) {
							return formatQuote(OddsType.DECIMAL, selectedMatch.homeOdds)
						}
						return formatQuote(
							OddsType.DECIMAL,
							selectedMatch?.[getOddsPropertyFromBetOption(activeTicketValues?.matches?.[0]?.betOption as BET_OPTIONS.WINNER_HOME)]
						)
					}
					return formatQuote(
						OddsType.DECIMAL,
						Number(activeTicketValues?.matches?.[0]?.[getOddsPropertyFromBetOption(activeTicketValues?.matches?.[0]?.betOption)])
					)
				}

				const totalQuote = getOdds()

				return {
					...activeTicketValues,
					totalQuote,
					totalBonus,
					payout,
					skew,
					potentionalProfit: potentionalProfit > 0 ? round(potentionalProfit, 2).toFixed(2) : 0
				}
			}
			return { ...activeTicketValues, totalQuote: 0, payout: 0, skew: 0, potentionalProfit: 0 }
		} catch (err) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('Something happened while processing the ticket') }], NOTIFICATION_TYPE.NOTIFICATION)
			throw new Error('Failed to fetch single ticket data', { cause: err })
		}
	}

	const handleConfirmTicket = async (values: IUnsubmittedBetTicket) => {
		try {
			// TODO: if the currency changes from USD to another, buyFromParlayWithDifferentCollateral is called
			dispatch({ type: ACTIVE_TICKET_SUBMITTING.SET, payload: true })
			const { parlayMarketsAMMContract, signer, sportsAMMContract } = networkConnector
			const parlayMarketsAMMContractWithSigner = parlayMarketsAMMContract?.connect(signer as any)
			const sportsMarketsAMMContractWithSigner = sportsAMMContract?.connect(signer as any)

			const sUSDPaid = ethers.utils.parseUnits((values.buyIn || 0).toString(), 'ether')
			const additionalSlippage = ethers.utils.parseEther(ADDITIONAL_SLIPPAGE)
			const expectedPayout = ethers.utils.parseEther(roundNumberToDecimals(Number(activeTicketValues.payout)).toString())
			let data
			// SINGLE
			if (
				getBetOptionAndAddressFromMatch(values?.matches).addresses.length === 1 &&
				getBetOptionAndAddressFromMatch(values?.matches).betTypes?.length === 1 &&
				!isCombined(values?.matches?.[0].betOption)
			) {
				const reqData = [
					getBetOptionAndAddressFromMatch(values?.matches).addresses[0],
					getBetOptionAndAddressFromMatch(values?.matches).betTypes[0],
					expectedPayout,
					sUSDPaid,
					additionalSlippage,
					REFERRER_WALLET
				]
				const estimationGas = await sportsMarketsAMMContractWithSigner?.estimateGas.buyFromAMMWithReferrer(...reqData)

				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)
				data = (await sportsMarketsAMMContractWithSigner?.buyFromAMMWithReferrer(...reqData, {
					gasLimit: chain?.id ? finalEstimation : undefined
				})) as ethers.ContractTransaction
			} else {
				// PARLAY
				const estimationGas = await parlayMarketsAMMContractWithSigner?.estimateGas.buyFromParlayWithReferrer(
					getBetOptionAndAddressFromMatch(values?.matches).addresses,
					getBetOptionAndAddressFromMatch(values?.matches).betTypes,
					sUSDPaid,
					additionalSlippage,
					expectedPayout,
					ZERO_ADDRESS,
					REFERRER_WALLET
				)

				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

				data = (await parlayMarketsAMMContractWithSigner?.buyFromParlayWithReferrer(
					getBetOptionAndAddressFromMatch(values?.matches).addresses,
					getBetOptionAndAddressFromMatch(values?.matches).betTypes,
					sUSDPaid,
					additionalSlippage,
					expectedPayout,
					ZERO_ADDRESS,
					REFERRER_WALLET,
					{
						gasLimit: finalEstimation
					}
				)) as ethers.ContractTransaction
			}
			await data?.wait().then(() => {
				handleRemoveTicket(Number(values.id))
				showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('The ticket was successfully submitted') }], NOTIFICATION_TYPE.NOTIFICATION)
			})
		} catch (e) {
			const err: any = e
			if (err?.code === 'ACTION_REJECTED') {
				showNotifications([{ type: MSG_TYPE.INFO, message: t('User rejected transaction') }], NOTIFICATION_TYPE.NOTIFICATION)
			} else {
				showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while submitting the ticket') }], NOTIFICATION_TYPE.NOTIFICATION)
			}
		} finally {
			dispatch({ type: ACTIVE_TICKET_SUBMITTING.SET, payload: false })
		}
	}

	const handleApproveAllowance = async () => {
		dispatch({ type: ACTIVE_TICKET_APPROVING.SET, payload: true })
		const { signer, sUSDContract, parlayMarketsAMMContract, sportsAMMContract } = networkConnector
		if (signer && sUSDContract) {
			try {
				const sUSDContractWithSigner = sUSDContract.connect(signer)
				const approveAmount = ethers.BigNumber.from(MAX_ALLOWANCE)
				const estimationGas = await sUSDContractWithSigner.estimateGas.approve(
					activeTicketMatchesCount === 1 ? sportsAMMContract?.address : parlayMarketsAMMContract?.address,
					approveAmount
				)
				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

				const tx = (await sUSDContractWithSigner.approve(
					activeTicketMatchesCount === 1 ? sportsAMMContract?.address : parlayMarketsAMMContract?.address,
					approveAmount,
					{
						gasLimit: chain?.id ? finalEstimation : undefined
					}
				)) as ethers.ContractTransaction
				await tx.wait().then(async () => {
					showNotifications([{ type: MSG_TYPE.SUCCESS, message: t('Your allowance was approved') }], NOTIFICATION_TYPE.NOTIFICATION)
					const newAllowence = await getAllowance()
					dispatch(change(FORM.BET_TICKET, 'allowance', newAllowence))
				})
			} catch (e) {
				const err: any = e
				if (err?.code === 'ACTION_REJECTED') {
					showNotifications([{ type: MSG_TYPE.INFO, message: t('User rejected transaction') }], NOTIFICATION_TYPE.NOTIFICATION)
				} else {
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while approving') }], NOTIFICATION_TYPE.NOTIFICATION)
				}
			} finally {
				dispatch({ type: ACTIVE_TICKET_APPROVING.SET, payload: false })
			}
		}
	}

	const handleRemoveMatch = (match: TicketPosition) => {
		const matches = dispatch(updateActiveTicketMatches(match, activeTicketValues?.matches))
		updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
	}

	const handleAddTicket = () => {
		const largestId = unsubmittedTickets?.reduce((maxId, ticket) => Math.max(maxId, ticket.id as number), 0)
		dispatch({
			type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
			payload: {
				data: unsubmittedTickets
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					  [...unsubmittedTickets, { id: (largestId || 1) + 1, matches: [], copied: false }]
					: [{ id: 1, matches: [], copied: false }]
			}
		})
		setActiveTicketID((largestId || 1) + 1)
		setIsSwitchedTicket(true)
		// TODO: scroll to last item
	}

	useEffect(() => {
		if (isSwitchedTicket) {
			setTimeout(() => {
				setIsSwitchedTicket(false)
			}, 1500)
		}
	}, [isSwitchedTicket])

	const modal = (
		<Modal
			open={deleteModal.visible}
			onCancel={() => {
				setDeleteModal({ visible: false, id: 0 })
			}}
			centered
		>
			<SC.ModalTitle>{t('Deleting ticket')}</SC.ModalTitle>
			<SC.ModalDescription style={{ marginBottom: '8px' }}>{t('Are you sure you want to delete a ticket with matches?')}</SC.ModalDescription>
			<Row>
				<SC.MatchContainerRow span={24}>
					{find(unsubmittedTickets, ['id', deleteModal.id])?.matches?.map((match: any, key: any) => (
						<MatchRow readOnly key={`matchRow-${key}`} match={match} />
					))}
				</SC.MatchContainerRow>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Button
						btnStyle={'secondary'}
						content={t('Keep the ticket')}
						onClick={() => {
							setDeleteModal({ visible: false, id: 0 })
						}}
					/>
				</Col>
				<Col span={24}>
					<Button
						btnStyle={'primary'}
						className={'error'}
						content={t('Delete')}
						onClick={() => {
							handleRemoveTicket(deleteModal.id)
							setDeleteModal({ visible: false, id: 0 })
						}}
					/>
				</Col>
			</Row>
		</Modal>
	)

	const bodyStyle = `
		<style>
			body {
	            @media (max-width: ${breakpoints.md}px) {
	            	overflow: hidden;
				}
	         }
		</style>
	`
	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			{rolledUp && <div dangerouslySetInnerHTML={{ __html: bodyStyle }} />}
			<SC.TicketBetWrapper rolledUp={rolledUp}>
				<SC.SubmittingSpinner
					spinning={isSubmitting || isApproving}
					size='large'
					indicator={<LoadingOutlined spin />}
					tip={isApproving ? t('Approving allowance..') : t('Submitting ticket...')}
				>
					<Spin spinning={isProcessing} size='small' indicator={<LoadingOutlined spin />}>
						<HorizontalScroller
							tickets={unsubmittedTickets ?? []}
							addTicket={handleAddTicket}
							setActiveTicket={handleSetActiveTicket}
							activeTicket={activeTicketValues}
							removeTicket={handleRemoveTicket}
							setDeleteModal={setDeleteModal}
						/>
						<MobileHeader
							rolledUp={rolledUp}
							setRolledUp={setRolledUp}
							tickets={unsubmittedTickets ?? []}
							addTicket={handleAddTicket}
							setActiveTicket={handleSetActiveTicket}
							activeTicket={activeTicketValues}
						/>
					</Spin>
					<TicketBetContainerForm
						fetchTicketData={
							(activeTicketValues?.matches?.length || 0) === 1 && !isCombined(activeTicketValues?.matches?.[0].betOption)
								? fetchSinglesTicketData
								: fetchParleyTicketData
						}
						isWalletConnected={isWalletConnected}
						handleApprove={handleApproveAllowance}
						onSubmit={handleConfirmTicket}
						handleDeleteItem={handleRemoveMatch}
						getAllowance={getAllowance}
						available={available}
						rolledUp={!isBellowOrEqualResolution(size, RESOLUTIONS.SEMIXXL) || rolledUp}
					/>
				</SC.SubmittingSpinner>
			</SC.TicketBetWrapper>
			{modal}
		</>
	)
}

export default TicketBetContainer
