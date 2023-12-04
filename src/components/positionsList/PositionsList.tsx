import React from 'react'

// components
import PositionListItem from './PositionListItem'
import CopyTicketButton from '../copyTicketButton/CopyTicketButton'

// types
import { PositionWithCombinedAttrs } from '@/typescript/types'

// utils
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { isWindowReady } from '@/utils/helpers'
import { OddsType } from '@/utils/constants'

// styles
import * as SC from './PositionsListStyles'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
	ticketData?: any
	isMyWallet: boolean
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes, ticketData, isMyWallet }: Props) => {
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL
	const isParlay = positionsWithCombinedAttrs?.length > 1

	const getOdds = (item: PositionWithCombinedAttrs, index: number) => {
		if (item?.isCombined && item?.odds) {
			return item.odds
		}
		if (isParlay) {
			return formatParlayQuote(Number(marketQuotes?.[index]))
		}

		return formatPositionOdds(item, actualOddType)
	}

	const hasOpenPositions = positionsWithCombinedAttrs?.some(
		// TODO: ongoing is not good because it is isOpen and isResolved at the same time
		(item) => item?.market?.isOpen && !item?.market?.isPaused && !item?.market?.isCanceled && !item?.market?.isResolved
	)

	const getCopyButtonTicket = (item: PositionWithCombinedAttrs, index: number) => {
		const newTicketsData = {
			...ticketData,
			positions: ticketData?.positions?.filter((market: any) => market.id === item.id),
			marketQuotes: [ticketData?.marketQuotes?.[index]],
			sportMarkets: ticketData?.sportMarkets?.filter((market: any) => market?.gameId === item.market.gameId),
			sportMarketsFromContract: ticketData?.sportMarketsFromContract?.filter((market: any) => market === item?.market?.address)
		}
		return newTicketsData
	}

	return (
		<>
			<SC.PositionsListWrapper>
				{positionsWithCombinedAttrs?.map((item, index) => {
					return (
						<PositionListItem
							position={item}
							isMyWallet={isMyWallet}
							quote={getOdds(item, index)}
							copyButtonTicket={getCopyButtonTicket(item, index)}
						/>
					)
				})}
			</SC.PositionsListWrapper>
			{hasOpenPositions && !isMyWallet && positionsWithCombinedAttrs?.length > 1 && <CopyTicketButton ticket={ticketData} />}
		</>
	)
}

export default PositionsList
