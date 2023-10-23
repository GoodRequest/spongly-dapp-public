import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { isEmpty } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { useNetwork } from 'wagmi'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'

// components
import PositionListItem from './PositionListItem'
import CopyModal from '../copyModal/CopyModal'
import Button from '@/atoms/button/Button'

// types
import { PositionWithCombinedAttrs, SGPItem } from '@/typescript/types'

// utils
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { FORM } from '@/utils/enums'

// hooks
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'

// styles
import * as SC from './PositionsListStyles'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { convertPositionNameToPosition, getMarketOddsFromContract, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'
import { GET_SPORT_MARKETS_FOR_GAME } from '@/utils/queries'
import { NETWORK_IDS } from '@/utils/constants'
import CopyTicketButton from '../copyTicketButton/CopyTicketButton'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
	sgpFees?: SGPItem[]
	ticketData?: any
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes, sgpFees, ticketData }: Props) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { sportsAMMContract } = networkConnector

	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const [fetchMarketsForGame] = useLazyQuery(GET_SPORT_MARKETS_FOR_GAME)

	const [copyModal, setCopyModal] = useState<{ open: boolean; onlyCopy: boolean }>({ open: false, onlyCopy: false })
	const [modalPositions, setModalPositions] = useState<any>(undefined)
	const [gamesToCopy, setGamesToCopy] = useState<any[]>([])

	const matchesWithChildMarkets = useMatchesWithChildMarkets(modalPositions, sgpFees, false)

	const isParlay = positionsWithCombinedAttrs?.length > 1

	const getOdds = (item: PositionWithCombinedAttrs, index: number) => {
		if (item?.isCombined) {
			return formatParlayQuote(item?.odds)
		}

		if (isParlay) {
			return formatParlayQuote(Number(marketQuotes?.[index]))
		}

		return formatPositionOdds(item)
	}

	const openCopyModal = (positions: any) => {
		setModalPositions(positions)
		setCopyModal({ open: true, onlyCopy: isEmpty(betTicket?.matches) })
	}

	const getOtherMarkets = async () => {
		// TODO loading
		const gameIDQuery = gamesToCopy?.map((item) => item?.gameId)

		fetchMarketsForGame({ variables: { gameId_in: gameIDQuery }, context: { chainId: chain?.id || NETWORK_IDS.OPTIMISM } }).then(async (values) => {
			try {
				const marketOddsFromContract = await getMarketOddsFromContract([...values.data.sportMarkets])

				const tempMatches = marketOddsFromContract.map((marketOdds) => {
					return {
						...marketOdds,
						betOption: gamesToCopy?.find((item) => item?.gameId === marketOdds.gameId)?.betOption
					}
				})
				openCopyModal(tempMatches)
			} catch (err) {
				console.error(err)
			}
		})
	}

	const formatMatchesToTicket = async () => {
		return Promise.all(
			positionsWithCombinedAttrs
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
			const filteredOngoingMatches = matches.filter((match) => !(match.awayOdds === 0 && match.homeOdds === 0))
			if (filteredOngoingMatches?.length > 0) {
				setGamesToCopy(filteredOngoingMatches)
			}
		}

		filterOngoingMatches()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<CopyModal
				isOpen={copyModal.open}
				onlyCopy={copyModal.onlyCopy}
				handleClose={() => setCopyModal({ open: false, onlyCopy: false })}
				matchesWithChildMarkets={matchesWithChildMarkets}
			/>
			<SC.PositionsListWrapper>
				{positionsWithCombinedAttrs?.map((item, index) => {
					return <PositionListItem openCopyModal={openCopyModal} position={item} quote={getOdds(item, index)} />
				})}
			</SC.PositionsListWrapper>
			<CopyTicketButton ticket={ticketData} />
			{/* {gamesToCopy?.length > 0 && (
				<Button btnStyle={'primary'} onClick={() => getOtherMarkets()} size={'large'} content={<span>{t('Copy open positions')}</span>} />
			)} */}
		</>
	)
}

export default PositionsList
