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
import { BET_OPTIONS, DoubleChanceMarketType, RESOLUTIONS } from '@/utils/enums'
import { sportsMarketContract } from '@/utils/contracts/sportsMarketContract'
import {
	ADDITIONAL_SLIPPAGE,
	Coins,
	CRYPTO_CURRENCY_MAP,
	FORM,
	GAS_ESTIMATION_BUFFER,
	MAX_ALLOWANCE,
	MAX_BUY_IN,
	MIN_BUY_IN_DEFAULT,
	MIN_BUY_IN_PARLAY,
	MIN_BUY_IN_SINGLE,
	MIN_TOKEN_AMOUNT,
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
	coinFormatter,
	coinParser,
	getBetOptionAndAddressFromMatch,
	getBetOptionFromMatchBetOption,
	getCollateralAddress,
	getCollateralIndex,
	getCollaterals,
	getDefaultCollateral,
	getOddByBetType,
	isBellowOrEqualResolution,
	isCombined,
	isStableCurrency,
	isWindowReady,
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
	ACTIVE_TICKET_ID,
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
import useExchangeRatesQuery, { Rates } from '@/hooks/useExchangeRatesQuery'

const TicketBetContainer = () => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { address } = useAccount()
	const isMounted = useIsMounted()
	const size = useMedia()
	const networkId = chain?.id || NETWORK_IDS.OPTIMISM

	const isProcessing = useSelector((state: RootState) => state.betTickets.isProcessing)
	const activeTicketID = useSelector((state: RootState) => state.betTickets.activeTicketID)
	const isSubmitting = useSelector((state: RootState) => state.betTickets.isSubmitting)
	const isApproving = useSelector((state: RootState) => state.betTickets.isApproving)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)

	const [rolledUp, setRolledUp] = useState(false)
	const [isSwitchedTicket, setIsSwitchedTicket] = useState(false)
	const [deleteModal, setDeleteModal] = useState({ visible: false, id: 0 })
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

	const activeTicketMatchesCount = activeTicketValues?.matches?.length || 0
	const minBuyIn = activeTicketMatchesCount === 1 ? MIN_BUY_IN_SINGLE : MIN_BUY_IN_PARLAY
	const parlayAmmDataQuery = useParlayAmmDataQuery(networkId)
	const multipleCollateralBalance = useMultipleCollateralBalanceQuery(address || '', networkId)?.data
	const available = multipleCollateralBalance?.[(activeTicketValues?.selectedStablecoin as keyof typeof multipleCollateralBalance) ?? STABLE_COIN.S_USD] ?? 0
	const availablePerPositionQuery = useAvailablePerPositionQuery(getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0], {
		enabled: activeTicketValues?.matches?.length === 1
	})
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL
	const isVoucherSelected = false // TODO: currently not supporting vouchers
	const isWalletConnected = isMounted && address && chain
	const defaultCollateral = getDefaultCollateral(networkId)
	const selectedCollateral = activeTicketValues?.selectedStablecoin
	const isDefaultCollateral = selectedCollateral === defaultCollateral
	const isEth = selectedCollateral === CRYPTO_CURRENCY_MAP.ETH
	const isDetailedView = true // TODO: what does it mean? (copied from Thales)

	const multipleCollateralBalances = useMultipleCollateralBalanceQuery(address as string, networkId, {
		enabled: !!isWalletConnected
	})

	const exchangeRatesQuery = useExchangeRatesQuery(networkId, {
		enabled: !!networkId
	})
	const exchangeRates: Rates | null = exchangeRatesQuery.isSuccess && exchangeRatesQuery.data ? exchangeRatesQuery.data : null

	const parlayAmmData = useMemo(() => {
		if (parlayAmmDataQuery.isSuccess && parlayAmmDataQuery.data) {
			return parlayAmmDataQuery.data
		}
		return undefined
	}, [parlayAmmDataQuery.isSuccess, parlayAmmDataQuery.data])

	const getUSDForCollateral = useCallback(
		(collateral: Coins) =>
			// eslint-disable-next-line no-unsafe-optional-chaining
			(multipleCollateralBalances.data ? multipleCollateralBalances.data?.[collateral] : 0) *
			(isStableCurrency(collateral as Coins) ? 1 : exchangeRates?.[collateral] || 0),
		[exchangeRates, multipleCollateralBalances.data]
	)

	const collateralsDetailsSorted = useMemo(() => {
		const mappedCollaterals = getCollaterals(networkId).map((collateral, index) => ({ name: collateral as Coins, index }))
		if (!isDetailedView) {
			return mappedCollaterals
		}
		return mappedCollaterals.sort((collateralA, collateralB) => getUSDForCollateral(collateralB.name) - getUSDForCollateral(collateralA.name))
	}, [getUSDForCollateral, isDetailedView, networkId])

	// TODO: set index to form and pick from formValues
	const selectedCollateralIndex = collateralsDetailsSorted?.find((collateral) => collateral.name === selectedCollateral)?.index

	const collateralAddress = useMemo(
		() => getCollateralAddress(networkId, isEth ? getCollateralIndex(networkId, CRYPTO_CURRENCY_MAP.WETH as Coins) : selectedCollateralIndex || 0),
		[networkId, selectedCollateralIndex, isEth]
	)

	const handleSetActiveTicket = async (ticket: IUnsubmittedBetTicket) => {
		dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE, payload: { data: unsubmittedTickets } })
		dispatch({ type: ACTIVE_TICKET_ID.SET, payload: ticket.id || 1 })
		setIsSwitchedTicket(true)
	}

	const handleRemoveTicket = (id: number) => {
		// NOTE: If there is only one ticket, we need to reset it and set UNSUBMITTED_BET_TICKETS and BET_TICKET matches to empty array (after submit ticket)
		if (unsubmittedTickets && unsubmittedTickets.length === 1) {
			dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_INIT, payload: { data: [{ id: 1, matches: [], copied: false }] } })
			dispatch(change(FORM.BET_TICKET, 'matches', []))
			dispatch({ type: ACTIVE_TICKET_ID.SET, payload: 1 })
		} else {
			// Otherwise we need to remove whole ticket from list
			const data = unsubmittedTickets && unsubmittedTickets.filter((ticket) => Number(ticket.id) !== id)
			dispatch({
				type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
				payload: { data }
			})
			if (activeTicketValues.id === id || data?.length === 1) {
				// NOTE: If selected ticket will be removed, we need to set active ticket to first ticket in list
				dispatch({ type: ACTIVE_TICKET_ID.SET, payload: data?.[0].id || 1 })
			}
		}
		// TODO: scroll to first item (if remove 10th ticket then select 1st ticket but need to be also scrolled left)
	}
	useEffect(() => {
		if (availablePerPositionQuery.isSuccess && availablePerPositionQuery.data) {
			setAvailablePerPosition(availablePerPositionQuery.data)
		}
	}, [availablePerPositionQuery.isSuccess, availablePerPositionQuery.data])

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
				selectedStablecoin: newActiveTicket?.selectedStablecoin ?? defaultCollateral,
				available:
					multipleCollateralBalance?.[(newActiveTicket?.selectedStablecoin as keyof typeof multipleCollateralBalance) ?? STABLE_COIN.S_USD] ?? 0,
				totalQuote: 0,
				maxTotalQuote: parlayAmmData?.maxSupportedOdds,
				maxBuyIn: parlayAmmData?.maxSupportedAmount || MAX_BUY_IN,
				minBuyIn: MIN_BUY_IN_DEFAULT,
				totalBonus: 0,
				payout: 0,
				buyIn: MIN_BUY_IN_DEFAULT,
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
		async (collateralAmountForQuote: number) => {
			const { parlayMarketsAMMContract, multiCollateralOnOffRampContract } = networkConnector
			if (parlayMarketsAMMContract && parlayAmmData?.minUsdAmount) {
				const marketsAddresses = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses
				const betOptions = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).betTypes
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [minimumReceivedForCollateralAmount, _minimumNeededForMinUsdAmountValue] = await Promise.all([
					isDefaultCollateral
						? 0
						: multiCollateralOnOffRampContract?.getMinimumReceived(
								collateralAddress,
								coinParser(collateralAmountForQuote.toString(), networkId, selectedCollateral as any)
						  ),
					// TODO: pre multiple collateral support treba ratat aj s minimumNeededForMinUsdAmountValue
					isDefaultCollateral
						? 0
						: multiCollateralOnOffRampContract?.getMinimumNeeded(collateralAddress, coinParser(collateralAmountForQuote.toString(), networkId))
				])

				const usdPaid = isDefaultCollateral ? coinParser(collateralAmountForQuote.toString(), networkId) : minimumReceivedForCollateralAmount

				try {
					return getParlayMarketsAMMQuoteMethod(
						collateralAddress,
						isDefaultCollateral,
						parlayMarketsAMMContract,
						marketsAddresses,
						betOptions,
						usdPaid
					)
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
		[networkId, activeTicketValues?.selectedStablecoin, activeTicketValues?.matches, activeTicketValues?.buyIn]
	)

	const fetchSinglesAmmQuote = useCallback(
		async (susdAmountForQuote: number, getExtendedQuote?: boolean) => {
			const { sportsAMMContract } = networkConnector
			if (activeTicketValues?.matches?.length === 1) {
				if (sportsAMMContract && parlayAmmData?.minUsdAmount && susdAmountForQuote) {
					const parsedAmount = ethers.utils.parseEther(roundNumberToDecimals(susdAmountForQuote).toString())
					const marketAddress = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0]
					const selectBetOption = getBetOptionFromMatchBetOption(activeTicketValues?.matches[0].betOption)
					try {
						const sportsAmmQuote = await getSportsAMMQuoteMethod(
							collateralAddress,
							isDefaultCollateral,
							sportsAMMContract,
							marketAddress,
							selectBetOption,
							parsedAmount
						)
						return isDefaultCollateral
							? getExtendedQuote
								? [sportsAmmQuote, sportsAmmQuote]
								: sportsAmmQuote
							: getExtendedQuote
							? sportsAmmQuote
							: sportsAmmQuote[0]
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
		[networkId, activeTicketValues?.selectedStablecoin, activeTicketValues?.matches, activeTicketValues?.buyIn]
	)

	const getAllowance = async () => {
		const { signer, sUSDContract, parlayMarketsAMMContract, multipleCollateral, sportsAMMContract } = networkConnector
		try {
			if (signer && sUSDContract && isWalletConnected && multipleCollateral && activeTicketValues.selectedStablecoin) {
				const collateralContractWithSigner = isDefaultCollateral
					? sUSDContract?.connect(signer)
					: multipleCollateral[activeTicketValues?.selectedStablecoin as Coins]?.connect(signer)

				// TODO: Add logic when user switch coin type
				let allowance = BigInt(0)
				if (activeTicketMatchesCount === 0) {
					allowance = BigInt(0)
				} else if (activeTicketMatchesCount === 1 && !isCombined(activeTicketValues?.matches?.[0].betOption)) {
					allowance = await collateralContractWithSigner?.allowance(address, sportsAMMContract?.address)
				} else if (activeTicketMatchesCount > 1 || isCombined(activeTicketValues?.matches?.[0].betOption)) {
					allowance = await collateralContractWithSigner?.allowance(address, parlayMarketsAMMContract?.address)
				}
				return Number(ethers.utils.formatEther(allowance))
			}
			return 0
		} catch (e) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while getting the allowance') }], NOTIFICATION_TYPE.NOTIFICATION)
			return 0
		}
	}

	const handleApproveAllowance = async () => {
		dispatch({ type: ACTIVE_TICKET_APPROVING.SET, payload: true })
		const { signer, sUSDContract, parlayMarketsAMMContract, multipleCollateral, sportsAMMContract } = networkConnector
		if (signer && sUSDContract && multipleCollateral) {
			const collateralContractWithSigner = isDefaultCollateral
				? sUSDContract?.connect(signer)
				: multipleCollateral[activeTicketValues?.selectedStablecoin as Coins]?.connect(signer)

			try {
				// const sUSDContractWithSigner = sUSDContract.connect(signer)
				const approveAmount = ethers.BigNumber.from(MAX_ALLOWANCE)
				const estimationGas = await collateralContractWithSigner?.estimateGas?.approve(
					activeTicketMatchesCount === 1 ? sportsAMMContract?.address : parlayMarketsAMMContract?.address,
					approveAmount
				)
				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

				const tx = (await collateralContractWithSigner?.approve(
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

	const fetchParleyTicketData = async () => {
		if (!activeTicketValues?.buyIn || Number(activeTicketValues?.buyIn) < minBuyIn)
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

				const calculatedBonusPercentageDec =
					(activeTicketValues?.matches || []).reduce((accumulator, currentItem) => {
						const bonusDecimal = getOddByBetType(currentItem as any, actualOddType).rawBonus / 100 + 1
						return accumulator * bonusDecimal
					}, 1) - 1

				const totalBonus = calculatedBonusPercentageDec ? round(calculatedBonusPercentageDec * 100, 2).toFixed(2) : null
				return {
					...activeTicketValues,
					totalQuote: formatQuote(actualOddType, totalQuote),
					rawQuote: totalQuote,
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
			if (!activeTicketValues?.buyIn || Number(activeTicketValues.buyIn) < minBuyIn || activeTicketValues?.matches?.length === 0 || !signer)
				return { ...activeTicketValues, totalQuote: 0, payout: 0, skew: 0, potentionalProfit: 0, totalBonus: 0 }

			const coin = isVoucherSelected ? undefined : selectedCollateral
			const currentAddress = getBetOptionAndAddressFromMatch(activeTicketValues?.matches).addresses[0]
			const contract = new ethers.Contract(currentAddress || '', sportsMarketContract.abi, signer)
			const roundedMaxAmount = floorNumberToDecimals(
				availablePerPosition[getBetOptionFromMatchBetOption(activeTicketValues?.matches?.[0].betOption as any)].available || 0
			)
			if (roundedMaxAmount) {
				const [collateralToSpendForMaxAmount, collateralToSpendForMinAmount, ammBalances] = await Promise.all([
					fetchSinglesAmmQuote(roundedMaxAmount),
					fetchSinglesAmmQuote(MIN_TOKEN_AMOUNT),
					contract.balancesOf(sportsAMMContract?.address)
				])

				const ammBalanceForSelectedPosition = ammBalances[getBetOptionAndAddressFromMatch(activeTicketValues.matches).betTypes[0]]

				const amountOfTokens =
					fetchAmountOfTokensForXsUSDAmount(
						Number(activeTicketValues?.buyIn),
						coinFormatter(collateralToSpendForMinAmount, networkId, coin as Coins),
						coinFormatter(collateralToSpendForMaxAmount, networkId, coin as Coins),
						availablePerPosition[getBetOptionFromMatchBetOption(activeTicketValues?.matches?.[0].betOption as any)].available || 0,
						coinFormatter(ammBalanceForSelectedPosition, networkId, coin as Coins)
					) || 0

				const flooredAmountOfTokens = floorNumberToDecimals(amountOfTokens)
				const quote = await fetchSinglesAmmQuote(flooredAmountOfTokens)
				const parsedQuote = coinFormatter(quote, networkId, coin as Coins)

				const recalculatedTokenAmount = roundNumberToDecimals((amountOfTokens * Number(activeTicketValues?.buyIn)) / parsedQuote)
				const maxAvailableTokenAmount = recalculatedTokenAmount > flooredAmountOfTokens ? flooredAmountOfTokens : recalculatedTokenAmount
				const payout = roundNumberToDecimals(maxAvailableTokenAmount ?? 0)
				const potentionalProfit = Number(maxAvailableTokenAmount) - Number(activeTicketValues.buyIn)
				const skew = 0
				// TODO: calculate number from bonus?
				// TODO: zistit ci sa neda zredukovat kod a zmazat getOdds
				const totalBonus = getOddByBetType(activeTicketValues?.matches?.[0] as any, actualOddType).rawBonus
					? round(Number(getOddByBetType(activeTicketValues?.matches?.[0] as any, actualOddType).rawBonus), 2).toFixed(2)
					: null
				const getOdds = () => {
					const selectedMatch = getMatchByBetOption(
						activeTicketValues?.matches?.[0]?.betOption as BET_OPTIONS.WINNER_HOME,
						activeTicketValues?.matches?.[0] as TicketPosition
					)

					if (selectedMatch) {
						if (selectedMatch?.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW) {
							return formatQuote(actualOddType, selectedMatch.homeOdds)
						}
						return formatQuote(
							actualOddType,
							selectedMatch?.[getOddsPropertyFromBetOption(activeTicketValues?.matches?.[0]?.betOption as BET_OPTIONS.WINNER_HOME)]
						)
					}
					return formatQuote(
						actualOddType,
						Number(activeTicketValues?.matches?.[0]?.[getOddsPropertyFromBetOption(activeTicketValues?.matches?.[0]?.betOption)])
					)
				}

				const totalQuote = getOdds()

				return {
					...activeTicketValues,
					totalQuote,
					totalBonus,
					rawQuote: Number(activeTicketValues?.matches?.[0]?.[getOddsPropertyFromBetOption(activeTicketValues?.matches?.[0]?.betOption)]),
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
			const sUSDPaid = coinParser((values.buyIn || 0).toString(), networkId)
			const additionalSlippage = ethers.utils.parseEther(ADDITIONAL_SLIPPAGE)
			const expectedPayout = ethers.utils.parseEther(roundNumberToDecimals(Number(activeTicketValues.payout)).toString())
			let data
			// SINGLE
			if (
				getBetOptionAndAddressFromMatch(values?.matches).addresses.length === 1 &&
				getBetOptionAndAddressFromMatch(values?.matches).betTypes?.length === 1 &&
				!isCombined(values?.matches?.[0].betOption)
			) {
				if (isDefaultCollateral) {
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
					// TODO: bude sa riesit aj with diffrent eth
				} else {
					const reqData = [
						getBetOptionAndAddressFromMatch(values?.matches).addresses[0],
						getBetOptionAndAddressFromMatch(values?.matches).betTypes[0],
						expectedPayout,
						sUSDPaid,
						additionalSlippage,
						collateralAddress,
						REFERRER_WALLET
					]
					const estimationGas = await sportsMarketsAMMContractWithSigner?.estimateGas.buyFromAMMWithDifferentCollateralAndReferrer(...reqData)

					const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

					data = (await sportsMarketsAMMContractWithSigner?.buyFromAMMWithDifferentCollateralAndReferrer(...reqData, {
						gasLimit: chain?.id ? finalEstimation : undefined
					})) as ethers.ContractTransaction
				}
				// PARLAY
			} else if (isDefaultCollateral) {
				const reqData = [
					getBetOptionAndAddressFromMatch(values?.matches).addresses,
					getBetOptionAndAddressFromMatch(values?.matches).betTypes,
					sUSDPaid,
					additionalSlippage,
					expectedPayout,
					ZERO_ADDRESS,
					REFERRER_WALLET
				]
				const estimationGas = await parlayMarketsAMMContractWithSigner?.estimateGas.buyFromParlayWithReferrer(...reqData)

				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)

				data = (await parlayMarketsAMMContractWithSigner?.buyFromParlayWithReferrer(...reqData, {
					gasLimit: finalEstimation
				})) as ethers.ContractTransaction
			} else {
				const reqData = [
					getBetOptionAndAddressFromMatch(values?.matches).addresses,
					getBetOptionAndAddressFromMatch(values?.matches).betTypes,
					sUSDPaid,
					additionalSlippage,
					expectedPayout,
					collateralAddress,
					REFERRER_WALLET
				]
				const estimationGas = await parlayMarketsAMMContractWithSigner?.estimateGas.buyFromParlayWithDifferentCollateralAndReferrer(...reqData)
				const finalEstimation = Math.ceil(Number(estimationGas) * GAS_ESTIMATION_BUFFER)
				data = (await parlayMarketsAMMContractWithSigner?.buyFromParlayWithDifferentCollateralAndReferrer(...reqData, {
					gasLimit: finalEstimation
				})) as ethers.ContractTransaction
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
		dispatch({ type: ACTIVE_TICKET_ID.SET, payload: (largestId || 1) + 1 })
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
			<SC.TicketBetWrapper $rolledUp={rolledUp}>
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
