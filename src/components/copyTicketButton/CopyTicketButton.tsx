import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getFormValues } from 'redux-form'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { useLazyQuery } from '@apollo/client'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { RootState } from '@/redux/rootReducer'
import { FORM } from '@/utils/enums'
import Button from '@/atoms/button/Button'
import { getMarketOddsFromContract } from '@/utils/markets'
import { GET_SPORT_MARKETS_FOR_GAME } from '@/utils/queries'

type Props = {
	setCopyModal: React.Dispatch<React.SetStateAction<{ visible: boolean; onlyCopy: boolean }>>
	setTempMatches: React.Dispatch<React.SetStateAction<any[]>>
	activeMatches: any[]
}

const CopyTicketButton = ({ setCopyModal, setTempMatches, activeMatches }: Props) => {
	const { t } = useTranslation()
	const betTicket: Partial<IUnsubmittedBetTicket> = useSelector((state: RootState) => getFormValues(FORM.BET_TICKET)(state))
	const [isLoading, setIsLoading] = useState(false)
	const { chain } = useNetwork()
	const [fetchMarketsForGame] = useLazyQuery(GET_SPORT_MARKETS_FOR_GAME)
	// console.log('activeMatches', activeMatches)
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
		<Button
			disabledPopoverText={t('Matches are no longer open to copy')}
			disabled={activeMatches?.length === 0} // If ticket with active matches is empty disable button
			btnStyle={'primary'}
			// TODO: opravit text podla toho aky druh je vybraty
			content={t('Copy ticket')}
			isLoading={isLoading}
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
	)
}

export default CopyTicketButton
