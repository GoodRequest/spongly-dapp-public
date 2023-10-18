import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { Row } from 'antd'
import { toNumber } from 'lodash'

// utils
import Flag from 'react-world-flags'
import { getTeamImageSource } from '@/utils/images'
import { MATCH_STATUS, NO_TEAM_IMAGE_FALLBACK, STATIC, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getParlayItemStatus } from '@/utils/helpers'
import networkConnector from '@/utils/networkConnector'
import { convertPositionNameToPosition, getMatchOddsContract, getSymbolText } from '@/utils/markets'

// types
import { Position } from '@/__generated__/resolvers-types'
import { PositionWithCombinedAttrs } from '@/typescript/types'

// atomss
import Button from '@/atoms/button/Button'

// styles
import * as SC from './PositionsListStyles'
import * as PSC from '@/components/ticketList/TicketItemStyles'
import { TAGS_LIST } from '@/utils/tags'
import { FlagWorldBig } from '@/styles/GlobalStyles'

type Props = {
	position: PositionWithCombinedAttrs
	quote: string | number
}

const PositionListItem = ({ position, quote }: Props) => {
	const { sportsAMMContract } = networkConnector
	const { t } = useTranslation()

	const [imgSrcHome, setImgSrcHome] = useState<string>(getTeamImageSource(position?.market?.homeTeam || '', toNumber(position?.market?.tags?.[0])))
	const [imgSrcAway, setImgSrcAway] = useState<string>(getTeamImageSource(position?.market?.awayTeam || '', toNumber(position?.market?.tags?.[0])))

	const [oddsDataFromContract, setOddsDataFromContract] = useState()

	const betOption = position?.isCombined ? position?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(position?.side), position.market)
	const isTotalWinner = position.market?.tags && TOTAL_WINNER_TAGS.includes(position.market.tags?.[0])

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

	const league = TAGS_LIST.find((item) => item.id === Number(position?.market?.tags?.[0]))
	// disabled={!(isMyWallet && isOpen && isntPlayedNow)}

	return (
		<SC.PositionListItem>
			<SC.ColCenteredVertically span={12}>
				<Row style={{ width: '100%' }}>
					<SC.TeamCol span={8}>
						<SC.Img
							src={imgSrcHome}
							alt={position.market?.homeTeam}
							onError={() => {
								setImgSrcHome(NO_TEAM_IMAGE_FALLBACK)
							}}
						/>
						<SC.MediumSpan> {position.market?.homeTeam}</SC.MediumSpan>
					</SC.TeamCol>
					<SC.TeamCol span={8} style={{ height: '100%' }}>
						{league?.country && league?.country !== STATIC.WORLD && (
							<div style={{ width: '68px', height: '68px' }}>
								<Flag code={league.country} />
							</div>
						)}
						{league?.country && league?.country === STATIC.WORLD && <FlagWorldBig />}
						<SC.VSSpan status={positionState.status}>{positionState?.result ? positionState?.result : 'VS'}</SC.VSSpan>
					</SC.TeamCol>
					<SC.TeamCol span={8}>
						{!isTotalWinner && (
							<>
								<SC.Img
									src={imgSrcAway}
									alt={position.market?.awayTeam}
									onError={() => {
										setImgSrcAway(NO_TEAM_IMAGE_FALLBACK)
									}}
								/>
								<SC.MediumSpan> {position.market?.awayTeam}</SC.MediumSpan>
							</>
						)}
					</SC.TeamCol>
				</Row>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				<SC.BlackBox>
					<SC.OddsWrapper>
						<SC.BetOption>{betOption}</SC.BetOption>
						<SC.MediumSpanGrey>{quote}</SC.MediumSpanGrey>
					</SC.OddsWrapper>
				</SC.BlackBox>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				{canBeCopied ? (
					<SC.ButtonWrapper>
						<SC.SmallSpan>{positionState?.text}</SC.SmallSpan>
						<Button
							btnStyle={'primary'}
							style={{ marginTop: '16px', maxHeight: '48px' }}
							onClick={() => console.log('TO DO')}
							size={'large'}
							content={<SC.MediumSpan>{t('Copy Position')}</SC.MediumSpan>}
						/>
					</SC.ButtonWrapper>
				) : (
					<SC.BlackBox style={{ paddingLeft: '16px', paddingRight: '16px' }}>
						<SC.SmallSpan>{t('Status')}</SC.SmallSpan>
						<PSC.TicketStatus style={{ marginTop: '12px' }} matchStatus={positionState.status}>
							{positionState?.status}
						</PSC.TicketStatus>
					</SC.BlackBox>
				)}
			</SC.ColCenteredVertically>
		</SC.PositionListItem>
	)
}

export default PositionListItem
