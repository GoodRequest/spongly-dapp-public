import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { isEmpty, map } from 'lodash'
import { Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { useLazyQuery } from '@apollo/client'

// components
import { useNetwork } from 'wagmi'
import TicketListItemHeader from '@/components/ticketList/TicketListItemHeader'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import Button from '@/atoms/button/Button'
import TicketItem from '@/components/ticketList/TicketItem'

// types
import { RootState } from '@/redux/rootReducer'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'

// utils
import { FORM } from '@/utils/enums'
import { convertPositionNameToPosition, getSymbolText } from '@/utils/markets'
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

	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const [activeMatches, setActiveMatches] = useState<any[]>([])
	const [isExpanded, setIsExpanded] = useState(false)
	const [testMatches] = useLazyQuery(GET_SPORT_MARKETS_FOR_GAME)

	const orderedPositions = orderPositionsAsSportMarkets(ticket)

	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticket, sgpFees)

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

	const handleCollapseChange = (e: any) => {
		setActiveKeysList([...e])
		setIsExpanded((c) => !c)
	}

	const handleSetTempMatches = async () => {
		const gameIDQuery = activeMatches?.map((item) => item?.gameId)

		testMatches({ variables: { gameId_in: gameIDQuery }, context: { chainId: chain?.id } })
			.then((values) => {
				// setTempMatches(activeMatches)
				setTempMatches(
					values?.data?.sportMarkets?.map((item: any) => {
						return { ...item, betOption: '2' }
					})
				)

				// console.log(values?.data?.sportMarkets)
				// console.log(activeMatches)
			})
			.catch(() => {
				setTempMatches(activeMatches)
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
							{/* <Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
									<Button
										btnStyle={'secondary'}
										content={t('Show ticket detail')}
										onClick={() => {
											// TODO: redirect to detail
										}}
									/>
								</Col> */}
							{(type === TICKET_TYPE.ONGOING_TICKET || type === TICKET_TYPE.OPEN_TICKET || type === TICKET_TYPE.HOT_TICKET) && (
								<Col md={12} span={24}>
									<Button
										disabledPopoverText={t('Matches are no longer open to copy')}
										disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
										btnStyle={'primary'}
										content={type === TICKET_TYPE.ONGOING_TICKET ? t('Copy open positions') : t('Copy ticket')}
										onClick={async () => {
											// NOTE: if ticket has matches open modal which ask if you want to replace ticket or create new one
											if (!isEmpty(betTicket?.matches)) {
												handleSetTempMatches()
												// setTempMatches(activeMatches)
												setCopyModal({ visible: true, onlyCopy: false })
											} else {
												handleSetTempMatches()
												// Otherwise create ticket
												// setTempMatches(activeMatches)
												setCopyModal({ visible: true, onlyCopy: true })
											}
										}}
									/>
								</Col>
							)}
							<Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
								{/* <Button
										btnStyle={'secondary'}
										content={t('Show ticket detail')}
										onClick={ handleCreateTicket }
									/> */}
							</Col>
						</SC.StylesRow>
					</SC.PanelContent>
				)}
			</SC.ColapsePanel>
		</SC.TicketCollapse>
	)
}

export default TicketListItem
