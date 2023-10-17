import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { isEmpty, map } from 'lodash'
import { Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { useLazyQuery } from '@apollo/client'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

// components
import TicketListItemHeader from '@/components/ticketList/TicketListItemHeader'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import Button from '@/atoms/button/Button'
import TicketItem from '@/components/ticketList/TicketItem'

// types
import { RootState } from '@/redux/rootReducer'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'

// utils
import { FORM, PAGES } from '@/utils/enums'
import { convertPositionNameToPosition, getMarketOddsFromContract, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'
import { TICKET_TYPE } from '@/utils/constants'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { GET_SPORT_MARKETS_FOR_GAME } from '@/utils/queries'
import { orderPositionsAsSportMarkets, getPositionsWithMergedCombinedPositions } from '@/utils/helpers'

// types
import { SGPItem } from '@/typescript/types'

// styles
import * as SC from './TicketListStyles'

interface ITicketListItem extends ITicketContent {
	type: string
	loading?: boolean
	index: string | number
	activeKeysList: any[]
	setActiveKeysList: Dispatch<SetStateAction<string[]>>
	setCopyModal: Dispatch<SetStateAction<any>>
	setTempMatches: Dispatch<SetStateAction<any>>
	sgpFees?: SGPItem[]
}

const TicketListItem: FC<ITicketListItem> = ({ index, ticket, loading, type, activeKeysList, setActiveKeysList, setCopyModal, setTempMatches, sgpFees }) => {
	const { t } = useTranslation()
	const { sportsAMMContract } = networkConnector
	const { chain } = useNetwork()
	const router = useRouter()

	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const [fetchMarketsForGame] = useLazyQuery(GET_SPORT_MARKETS_FOR_GAME)

	const [activeMatches, setActiveMatches] = useState<any[]>([])
	const [isExpanded, setIsExpanded] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const orderedPositions = orderPositionsAsSportMarkets(ticket)
	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticket, sgpFees)

	const formatMatchesToTicket = async () => {
		return Promise.all(
			positionsWithMergedCombinedPositions
				?.filter((item) => item.market.isOpen)
				.map(async (item) => {
					const data = await sportsAMMContract?.getMarketDefaultOdds(item.market.address, false)
					return {
						...item.market,
						gameId: item.market.gameId,
						homeOdds: bigNumberFormatter(data?.[0] || 0),
						awayOdds: bigNumberFormatter(data?.[1] || 0),
						drawOdds: bigNumberFormatter(data?.[2] || 0),
						betOption: item?.isCombined ? item?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(item.side), item.market)
					}
				})
		)
	}

	useEffect(() => {
		const filterOngoingMatches = async () => {
			const matches = await formatMatchesToTicket()
			const filterOngoingMatches = matches.filter((match) => !(match.awayOdds === 0 && match.homeOdds === 0))
			setActiveMatches(filterOngoingMatches)
		}

		filterOngoingMatches()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticket])

	const handleCollapseChange = (e: any) => {
		setActiveKeysList([...e])
		setIsExpanded((c) => !c)
	}

	const handleSetTempMatches = async (onlyCopy: boolean) => {
		setIsLoading(true)
		const gameIDQuery = activeMatches?.map((item) => item?.gameId)

		// NOTE: fetch rest of the available betOptions
		fetchMarketsForGame({ variables: { gameId_in: gameIDQuery }, context: { chainId: chain?.id } })
			.then(async (values) => {
				try {
					const marketOddsFromContract = await getMarketOddsFromContract([...values.data.sportMarkets])

					setTempMatches(
						marketOddsFromContract.map((marketOdds) => {
							return {
								...marketOdds,
								// NOTE: every bet is different game.
								betOption: activeMatches?.find((activeMatch) => activeMatch.gameId === marketOdds.gameId)?.betOption
							}
						})
					)
				} catch (err) {
					setTempMatches(activeMatches)
				} finally {
					setCopyModal({ visible: true, onlyCopy })
					setIsLoading(false)
				}
			})
			.catch(() => {
				setTempMatches(activeMatches)
				setCopyModal({ visible: true, onlyCopy })
				setIsLoading(false)
			})
	}

	return (
		<SC.TicketCollapse
			collapsible={'icon'}
			expandIconPosition={'end'}
			onChange={(e) => handleCollapseChange(e)}
			isExpanded={isExpanded}
			activeKey={activeKeysList}
		>
			<SC.ColapsePanel header={<TicketListItemHeader ticket={ticket} />} key={`${ticket.account}-${index}`}>
				{!loading && isExpanded && (
					<SC.PanelContent>
						<SC.StylesRow gutter={[16, 16]}>
							{map(positionsWithMergedCombinedPositions, (item, index) => (
								<Col key={item.id} span={24} lg={12}>
									<TicketItem
										match={item}
										oddsInfo={{
											quote: item?.isCombined ? item?.odds : Number(ticket?.marketQuotes?.[index]),
											isParlay: orderedPositions.length > 1,
											isCombined: item?.isCombined,
											combinedPositionsText: item?.combinedPositionsText
										}}
									/>
								</Col>
							))}
						</SC.StylesRow>
						<SC.StylesRow gutter={[16, 0]}>
							{(type === TICKET_TYPE.ONGOING_TICKET || type === TICKET_TYPE.OPEN_TICKET || type === TICKET_TYPE.HOT_TICKET) && (
								<Col md={12} span={24}>
									<Button
										disabledPopoverText={t('Matches are no longer open to copy')}
										disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
										btnStyle={'primary'}
										isLoading={isLoading}
										content={type === TICKET_TYPE.ONGOING_TICKET ? t('Copy open positions') : t('Copy ticket')}
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
								</Col>
							)}
							<Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
								<Button
									btnStyle={'secondary'}
									content={t('Show ticket detail')}
									onClick={() => router.push(`/${PAGES.TICKET_DETAIL}/?ticketId=${ticket.id}&previousPath=${router.asPath}`)}
								/>
							</Col>
						</SC.StylesRow>
					</SC.PanelContent>
				)}
			</SC.ColapsePanel>
		</SC.TicketCollapse>
	)
}

export default TicketListItem
