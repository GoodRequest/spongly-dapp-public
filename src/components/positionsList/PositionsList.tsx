import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'
import { isEmpty } from 'lodash'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'

// components
import PositionListItem from './PositionListItem'
import CopyModal from '../copyModal/CopyModal'

// types
import { PositionWithCombinedAttrs, SGPItem } from '@/typescript/types'

// utils
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { FORM } from '@/utils/enums'

// hooks
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'

// styles
import * as SC from './PositionsListStyles'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
	sgpFees?: SGPItem[]
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes, sgpFees }: Props) => {
	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))

	const [copyModal, setCopyModal] = useState<{ open: boolean; onlyCopy: boolean }>({ open: false, onlyCopy: false })
	const [modalPositions, setModalPositions] = useState<any>(undefined)

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
		</>
	)
}

export default PositionsList
