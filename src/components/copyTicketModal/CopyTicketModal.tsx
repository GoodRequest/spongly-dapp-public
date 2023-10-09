import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-export-i18n'
import { Col, Row } from 'antd'
import { groupBy, toPairs } from 'lodash'
import { change, getFormValues } from 'redux-form'
import { useNetwork } from 'wagmi'
import * as SC from './CopyTicketModalStyles'
import MatchRow from '@/components/ticketBetContainer/components/matchRow/MatchRow'
import Button from '@/atoms/button/Button'
import { MAX_TICKETS, Network } from '@/utils/constants'
import Modal from '@/components/modal/Modal'
import { BetType } from '@/utils/tags'
import { ACTIVE_BET_TICKET, IUnsubmittedBetTicket, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'
import { FORM } from '@/utils/enums'
import { SGPItem } from '@/typescript/types'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { copyTicketToUnsubmittedTickets, orderPositionsAsSportMarkets } from '@/utils/helpers'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { convertPositionNameToPosition, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'

type Props = {
	copyModal: { visible: boolean; onlyCopy: boolean }
	setCopyModal: React.Dispatch<React.SetStateAction<{ visible: boolean; onlyCopy: boolean }>>
	setActiveMatches: React.Dispatch<React.SetStateAction<any[]>>
	tempMatches: any[]
	ticket: any
}

const CopyTicketModal = ({ setCopyModal, copyModal, tempMatches, ticket, setActiveMatches }: Props) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { chain } = useNetwork()
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const { sportsAMMContract } = networkConnector
	const orderedPositions = orderPositionsAsSportMarkets(ticket)

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	const formatMatchesToTicket = async () => {
		return Promise.all(
			orderedPositions
				?.filter((item) => item.market.isOpen)
				.map(async (item) => {
					const data = await sportsAMMContract?.getMarketDefaultOdds(item.market.address, false)
					return {
						...item.market,
						gameId: item.market.gameId,
						homeOdds: bigNumberFormatter(data?.[0] || 0),
						awayOdds: bigNumberFormatter(data?.[1] || 0),
						drawOdds: bigNumberFormatter(data?.[2] || 0),
						betOption: item?.isCombined
							? item?.combinedPositionsText?.replace('&', '')
							: getSymbolText(convertPositionNameToPosition(item.side), item.market)
					}
				})
		)
	}

	useEffect(() => {
		const filterOngoingMatches = async () => {
			const matches = await formatMatchesToTicket()

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

	// TODO: daniel zrefactoruje tak nahradit generickym hookom ktory spravi
	const getMatchesWithChildMarkets = useMemo(() => {
		const matchesWithChildMarkets = toPairs(groupBy(tempMatches, 'gameId')).map(([, markets]) => {
			const [match] = markets
			const winnerTypeMatch = markets.find((market) => Number(market.betType) === BetType.WINNER)
			const doubleChanceTypeMatches = markets.filter((market) => Number(market.betType) === BetType.DOUBLE_CHANCE)
			const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD)
			const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL)
			const combinedTypeMatch = sgpFees?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
			return {
				...(winnerTypeMatch ?? tempMatches.find((item: any) => item.gameId === match?.gameId)),
				winnerTypeMatch,
				doubleChanceTypeMatches,
				spreadTypeMatch,
				totalTypeMatch,
				combinedTypeMatch
			}
		})

		return matchesWithChildMarkets?.map((item) => {
			if (item?.winnerTypeMatch && item?.totalTypeMatch && item?.combinedTypeMatch) {
				return {
					...item,
					betOption: `${item.winnerTypeMatch.betOption}&${item.totalTypeMatch.betOption}`
				}
			}

			return item
		})
	}, [sgpFees, tempMatches])
	const handleAddTicket = async () => {
		const largestId = unsubmittedTickets?.reduce((maxId, ticket) => {
			return Math.max(maxId, ticket.id as number)
		}, 0)
		const matches = getMatchesWithChildMarkets || []

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
		// NOTE: set active state for new ticket item in HorizontalScroller id === data.length (actual state of tickets and set active ticket to last item)
		await dispatch({ type: ACTIVE_BET_TICKET.ACTIVE_BET_TICKET_SET, payload: { data: { id: (largestId || 1) + 1 } } })
	}
	const handleCopyTicket = async () => {
		copyTicketToUnsubmittedTickets(getMatchesWithChildMarkets as any, unsubmittedTickets, dispatch, activeTicketValues.id)
		dispatch(change(FORM.BET_TICKET, 'matches', getMatchesWithChildMarkets))
		dispatch(change(FORM.BET_TICKET, 'copied', true))
		// helper variable which says that ticket has matches which were copied
	}

	return (
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
			<Row>
				<SC.MatchContainerRow span={24}>
					{getMatchesWithChildMarkets?.map((match: any, key: any) => (
						<MatchRow readOnly copied key={`matchRow-${key}`} match={match} />
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
}

export default CopyTicketModal
