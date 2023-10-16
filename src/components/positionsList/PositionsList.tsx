import React from 'react'
import { PositionWithCombinedAttrs } from '@/typescript/types'

import * as SC from './PositionsListStyles'
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import PositionListItem from './PositionListItem'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes }: Props) => {
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
	// NOTE: showing historic odds -> there is no bonus.
	// const getBonus = (item: PositionWithCombinedAttrs) => {
	// 	return '1%'
	// }

	return (
		<SC.PositionsListWrapper>
			{positionsWithCombinedAttrs?.map((item, index) => {
				return <PositionListItem position={item} quote={getOdds(item, index)} />
			})}
		</SC.PositionsListWrapper>
	)
}

export default PositionsList
