import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { change, getFormValues } from 'redux-form'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { Col, Row } from 'antd'

import { ACTIVE_TICKET_ID, IUnsubmittedBetTicket, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'
import Button from '@/atoms/button/Button'
import { convertPositionNameToPosition, getMarketOddsFromContract, getSymbolText } from '@/utils/markets'
import { GET_SPORT_MARKETS_FOR_GAME } from '@/utils/queries'
import Modal from '@/components/modal/Modal'
import * as SC from './CopyTicketButtonStyles'
import MatchRow from '@/components/ticketBetContainer/components/matchRow/MatchRow'
import { FORM, MAX_TICKETS, MSG_TYPE, Network, NETWORK_IDS, NOTIFICATION_TYPE } from '@/utils/constants'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { copyTicketToUnsubmittedTickets, getPositionsWithMergedCombinedPositions, orderPositionsAsSportMarkets } from '@/utils/helpers'
import { SGPItem } from '@/typescript/types'
import networkConnector from '@/utils/networkConnector'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'
import { getDefaultDecimalsForNetwork } from '@/utils/network'
import { showNotifications } from '@/utils/tsxHelpers'

type Props = {
	ticket: any
	isPosition?: boolean
}

const CopyTicketButton = ({ ticket, isPosition }: Props) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const dispatch = useDispatch()
	const [fetchMarketsForGame] = useLazyQuery(GET_SPORT_MARKETS_FOR_GAME)
	const { sportsAMMContract } = networkConnector

	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket

	const [isLoading, setIsLoading] = useState(false)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const [copyModal, setCopyModal] = useState<{ visible: boolean; onlyCopy: boolean }>({ visible: false, onlyCopy: false })
	const [tempMatches, setTempMatches] = useState<any>()
	const [activeMatches, setActiveMatches] = useState<any[]>([])

	const sgpFeesRaw = useSGPFeesQuery((chain?.id as Network) || NETWORK_IDS.OPTIMISM, {
		enabled: true
	})

	const matchesWithChildMarkets = useMatchesWithChildMarkets(tempMatches, sgpFees, false)

	const orderedPositions = orderPositionsAsSportMarkets(ticket)

	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions as any, ticket, sgpFees)

	const formatMatchesToTicket = async () => {
		const decimals = getDefaultDecimalsForNetwork(chain?.id || NETWORK_IDS.OPTIMISM)
		return Promise.all(
			positionsWithMergedCombinedPositions
				?.filter((item) => item.market.isOpen)
				.map(async (item) => {
					const data = await sportsAMMContract?.getMarketDefaultOdds(item.market.address, false)
					return {
						...item.market,
						gameId: item.market.gameId,
						homeOdds: bigNumberFormatter(data?.[0] || 0, decimals),
						awayOdds: bigNumberFormatter(data?.[1] || 0, decimals),
						drawOdds: bigNumberFormatter(data?.[2] || 0, decimals),
						betOption: item?.isCombined ? item?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(item.side), item.market)
					}
				})
		)
	}

	useEffect(() => {
		const filterOngoingMatches = async () => {
			const matches = await formatMatchesToTicket()
			// TODO: add logig that check if bet type is not supported with BetType enum
			const filterOngoingMatches = matches.filter((match) => !(match.awayOdds === 0 && match.homeOdds === 0 && match.awayOdds === 0))
			setActiveMatches(filterOngoingMatches)
		}

		filterOngoingMatches()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticket])

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	const handleAddTicket = async () => {
		const largestId = unsubmittedTickets?.reduce((maxId, ticket) => {
			return Math.max(maxId, ticket.id as number)
		}, 0)
		const matches = matchesWithChildMarkets || []

		const data = unsubmittedTickets
			? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			  [...unsubmittedTickets, { id: (largestId || 1) + 1, matches, copied: true }]
			: [{ id: 1, matches, copied: true }]
		await dispatch({
			type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_UPDATE,
			payload: {
				data
			}
		})
		// set active created ticket ID (useEffect in TicketBetCointainter initialize data with this new ticket ID)
		await dispatch({ type: ACTIVE_TICKET_ID.SET, payload: (largestId || 1) + 1 })
		// TODO: scroll to end if this is 4th or 5th ticket and show arrow right
	}
	const handleCopyTicket = async () => {
		copyTicketToUnsubmittedTickets(matchesWithChildMarkets as any, unsubmittedTickets, dispatch, activeTicketValues.id)
		dispatch(change(FORM.BET_TICKET, 'matches', matchesWithChildMarkets))
		dispatch(change(FORM.BET_TICKET, 'copied', true))
		// helper variable which says that ticket has matches which were copied
	}

	const handleSetTempMatches = async (onlyCopy: boolean) => {
		setIsLoading(true)
		const filteredActiveMatches = activeMatches?.filter((item) => !!item?.betOption)

		if (filteredActiveMatches?.length === 0) {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('None of the bets can be copied') }], NOTIFICATION_TYPE.NOTIFICATION)
			setIsLoading(false)
			return
		}

		const gameIDQuery = filteredActiveMatches?.map((item) => item?.gameId)

		// NOTE: fetch rest of the available betOptions
		fetchMarketsForGame({ variables: { gameId_in: gameIDQuery }, context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM } })
			.then(async (values) => {
				try {
					const marketOddsFromContract = await getMarketOddsFromContract([...values.data.sportMarkets], chain?.id || NETWORK_IDS.OPTIMISM)

					const formattedMarketOddsFromContract = marketOddsFromContract.map((marketOdds) => {
						return {
							...marketOdds,
							// NOTE: every bet is different game.
							betOption: filteredActiveMatches?.find((activeMatch) => activeMatch.gameId === marketOdds.gameId)?.betOption
						}
					})
					setTempMatches(formattedMarketOddsFromContract)
				} catch (err) {
					setTempMatches(filteredActiveMatches)
				} finally {
					setCopyModal({ visible: true, onlyCopy })
					setIsLoading(false)
				}
			})
			.catch(() => {
				setTempMatches(filteredActiveMatches)
				setCopyModal({ visible: true, onlyCopy })
				setIsLoading(false)
			})
	}

	const modals = (
		<Modal
			open={copyModal.visible}
			onCancel={() => {
				setCopyModal({ visible: false, onlyCopy: false })
			}}
			centered
		>
			{copyModal.onlyCopy ? (
				<SC.ModalTitle>{t('Do you wish to add these matches?')}</SC.ModalTitle>
			) : (
				<>
					<SC.ModalTitle>{t('Your ticket already includes matches')}</SC.ModalTitle>
					<SC.ModalDescription style={{ marginBottom: '8px' }}>
						{t('Do you wish to replace these matches or create a new ticket?')}
					</SC.ModalDescription>
				</>
			)}
			<SC.ModalDescriptionWarning>{t('Odds might slightly differ')}</SC.ModalDescriptionWarning>
			<Row gutter={[16, 0]}>
				<SC.MatchContainerRow span={24}>
					{matchesWithChildMarkets?.map((match: any, key: any) => (
						<MatchRow readOnly key={`matchRow-${key}`} match={match} />
					))}
				</SC.MatchContainerRow>
			</Row>
			<Row gutter={[16, 16]}>
				{copyModal.onlyCopy ? (
					<Col span={24}>
						<Button
							btnStyle={'secondary'}
							content={t('Add these to ticket')}
							onClick={() => {
								setCopyModal({ visible: false, onlyCopy: false })
								handleCopyTicket()
							}}
						/>
					</Col>
				) : (
					<>
						<Col span={24}>
							<Button
								btnStyle={'secondary'}
								content={`${t('Replace existing ticket')} (Ticket ${
									Number(unsubmittedTickets?.map((e) => e.id).indexOf(activeTicketValues.id)) + 1
								})`}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleCopyTicket()
								}}
							/>
						</Col>
						<Col span={24}>
							<Button
								btnStyle={'primary'}
								content={`${t('Create new ticket')} (Ticket ${Number(unsubmittedTickets?.length) + 1})`}
								disabled={unsubmittedTickets?.length === MAX_TICKETS}
								onClick={() => {
									setCopyModal({ visible: false, onlyCopy: false })
									handleAddTicket()
								}}
							/>
						</Col>
					</>
				)}
			</Row>
		</Modal>
	)
	return (
		<>
			{modals}
			<Button
				disabledPopoverText={activeMatches?.length === 1 ? t('Match is no longer open to copy') : t('Matches are no longer open to copy')}
				disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
				btnStyle={'primary'}
				// style={isPosition ? { height: '36px' } : undefined}
				// TODO: opravit text podla toho aky druh je vybraty
				content={isPosition ? t('Copy position') : t('Copy ticket')}
				loading={isLoading}
				onClick={async () => {
					// NOTE: if ticket has matches open modal which ask if you want to replace ticket or create new one
					if (!isEmpty(betTicket?.matches)) {
						handleSetTempMatches(false)
					} else {
						// NOTE: Otherwise create ticket
						handleSetTempMatches(true)
					}
				}}
			/>
		</>
	)
}

export default CopyTicketButton
