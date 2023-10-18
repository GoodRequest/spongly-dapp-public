import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { Row } from 'antd'
import { toNumber } from 'lodash'

// utils
import { getTeamImageSource } from '@/utils/images'
import { MATCH_STATUS, NO_TEAM_IMAGE_FALLBACK } from '@/utils/constants'
import { getParlayItemStatus } from '@/utils/helpers'
import networkConnector from '@/utils/networkConnector'
import { convertPositionNameToPosition, getMatchOddsContract, getSymbolText } from '@/utils/markets'

// types
import { Position } from '@/__generated__/resolvers-types'
import { PositionWithCombinedAttrs } from '@/typescript/types'

// atoms
import Button from '@/atoms/button/Button'

// styles
import * as SC from './PositionsListStyles'
import * as PSC from '@/components/ticketList/TicketItemStyles'

type Props = {
	position: PositionWithCombinedAttrs
	quote: string | number
}

const PositionListItem = ({ position, quote }: Props) => {
	const { sportsAMMContract } = networkConnector
	const { t } = useTranslation()

	const [oddsDataFromContract, setOddsDataFromContract] = useState()

	const betOption = position?.isCombined ? position?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(position?.side), position.market)

	const fetchOddsData = async () => {
		try {
			const data = await sportsAMMContract?.getMarketDefaultOdds(position.market.address, false)
			setOddsDataFromContract(data)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('error', error)
		}
	}

	useEffect(() => {
		fetchOddsData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isPlayedNow = () => {
		if (oddsDataFromContract) {
			if (position.market.isOpen && getMatchOddsContract(position.side, oddsDataFromContract) === '0' && !position.market.isPaused) {
				return true
			}
		}

		return false
	}

	const positionState = getParlayItemStatus(position as Position, isPlayedNow(), t)
	const canBeCopied = positionState.status === MATCH_STATUS.OPEN

	return (
		<SC.PositionListItem>
			<SC.ColCenteredVertically span={12}>
				<Row style={{ width: '100%' }}>
					<SC.TeamCol span={6}>
						<SC.Img
							src={
								getTeamImageSource(position.market?.homeTeam || '', toNumber(position.market?.tags?.[0]))
									? getTeamImageSource(position.market?.homeTeam || '', toNumber(position.market?.tags?.[0]))
									: NO_TEAM_IMAGE_FALLBACK
							}
							alt={position.market?.homeTeam}
						/>
						<SC.MediumSpan> {position.market?.homeTeam}</SC.MediumSpan>
					</SC.TeamCol>
					<SC.TeamCol span={6}>
						<SC.VSSpan>VS</SC.VSSpan>
					</SC.TeamCol>
					<SC.TeamCol span={6}>
						<SC.Img
							src={
								getTeamImageSource(position.market?.awayTeam || '', toNumber(position.market?.tags?.[0]))
									? getTeamImageSource(position.market?.awayTeam || '', toNumber(position.market?.tags?.[0]))
									: NO_TEAM_IMAGE_FALLBACK
							}
							alt={position.market?.awayTeam}
						/>
						<SC.MediumSpan> {position.market?.awayTeam}</SC.MediumSpan>
					</SC.TeamCol>
				</Row>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				<SC.BlackBox>
					<SC.MediumSpan>{t('Position')}</SC.MediumSpan>
					<SC.OddsWrapper>
						<SC.MediumSpan>{betOption}</SC.MediumSpan>
						<SC.MediumSpanGrey>{quote}</SC.MediumSpanGrey>
					</SC.OddsWrapper>
				</SC.BlackBox>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				{canBeCopied ? (
					<Button
						btnStyle={'primary'}
						style={{ marginLeft: '16px', marginRight: '16px' }}
						onClick={() => console.log('TO DO')}
						// disabled={!(isMyWallet && isOpen && isntPlayedNow)}
						size={'large'}
						content={<SC.MediumSpan>{t('Copy Position')}</SC.MediumSpan>}
					/>
				) : (
					<SC.BlackBox>
						<SC.MediumSpan>{t('Status')}</SC.MediumSpan>
						<PSC.TicketStatus matchStatus={positionState.status}>{positionState?.status}</PSC.TicketStatus>
					</SC.BlackBox>
				)}
			</SC.ColCenteredVertically>
		</SC.PositionListItem>
	)
}

export default PositionListItem
