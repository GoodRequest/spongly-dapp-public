import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { Row } from 'antd'
import { toNumber } from 'lodash'
import Flag from 'react-world-flags'

// utils
import { getTeamImageSource } from '@/utils/images'
import { MATCH_STATUS, NO_TEAM_IMAGE_FALLBACK, STATIC, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getParlayItemStatus } from '@/utils/helpers'
import networkConnector from '@/utils/networkConnector'
import { convertPositionNameToPosition, getMatchOddsContract, getSymbolText } from '@/utils/markets'
import { TAGS_LIST } from '@/utils/tags'

// types
import { Position } from '@/__generated__/resolvers-types'
import { PositionWithCombinedAttrs } from '@/typescript/types'

// components
import CopyTicketButton from '../copyTicketButton/CopyTicketButton'

// styles
import * as SC from './PositionsListStyles'
import * as PSC from '@/components/ticketList/TicketItemStyles'
import { FlagWorldBig } from '@/styles/GlobalStyles'

type Props = {
	position: PositionWithCombinedAttrs
	quote: string | number
	copyButtonTicket: any
	isMyWallet: boolean
}

const PositionListItem = ({ position, quote, copyButtonTicket, isMyWallet }: Props) => {
	const { sportsAMMContract } = networkConnector
	const { t } = useTranslation()

	const [imgSrcHome, setImgSrcHome] = useState<string>(getTeamImageSource(position?.market?.homeTeam || '', toNumber(position?.market?.tags?.[0])))
	const [imgSrcAway, setImgSrcAway] = useState<string>(getTeamImageSource(position?.market?.awayTeam || '', toNumber(position?.market?.tags?.[0])))
	const [isPlayedNow, setIsPlayedNow] = useState(false)

	const betOption = position?.isCombined ? position?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(position?.side), position.market)
	const isTotalWinner = position.market?.tags && TOTAL_WINNER_TAGS.includes(position.market.tags?.[0])

	const fetchOddsData = async () => {
		try {
			const data = await sportsAMMContract?.getMarketDefaultOdds(position.market.address, false)

			if (data) {
				if (position.market.isOpen && getMatchOddsContract(position.side, data) === '0' && !position.market.isPaused) {
					setIsPlayedNow(true)
				}
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('error', error)
		}
	}

	useEffect(() => {
		fetchOddsData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const positionState = getParlayItemStatus(position as Position, isPlayedNow, t)
	const canBeCopied = positionState.status === MATCH_STATUS.OPEN

	const league = TAGS_LIST.find((item) => item.id === Number(position?.market?.tags?.[0]))

	return (
		<SC.PositionListItem gutter={[0, 16]}>
			<SC.ColCenteredVertically lg={{ span: 12 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
				<Row style={{ width: '100%' }}>
					<SC.TeamCol span={10}>
						<SC.Img
							src={imgSrcHome}
							alt={position.market?.homeTeam}
							onError={() => {
								setImgSrcHome(NO_TEAM_IMAGE_FALLBACK)
							}}
						/>
						<SC.MediumSpan> {position.market?.homeTeam}</SC.MediumSpan>
					</SC.TeamCol>
					<SC.TeamCol span={4} style={{ height: '100%' }}>
						{league?.country && league?.country !== STATIC.WORLD && (
							<SC.FlagWrapper>
								<Flag code={league.country} />
							</SC.FlagWrapper>
						)}
						{league?.country && league?.country === STATIC.WORLD && <FlagWorldBig />}
						<SC.VSSpan status={positionState.status}>{positionState?.result ? positionState?.result : 'VS'}</SC.VSSpan>
					</SC.TeamCol>
					<SC.TeamCol span={10}>
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
			<SC.ColCenteredVertically lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
				<SC.BlackBox>
					<SC.OddsWrapper>
						<SC.BetOption>{betOption}</SC.BetOption>
						<SC.MediumSpanGrey>{quote}</SC.MediumSpanGrey>
					</SC.OddsWrapper>
				</SC.BlackBox>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
				{canBeCopied && !isMyWallet ? (
					<SC.ButtonWrapper>
						<SC.SmallSpan style={{ marginBottom: '12px' }}>{positionState?.text}</SC.SmallSpan>
						<CopyTicketButton ticket={copyButtonTicket} isPosition={true} />
					</SC.ButtonWrapper>
				) : (
					<SC.BlackBox>
						<SC.SmallSpan>{t('Status')}</SC.SmallSpan>
						<PSC.TicketStatus style={{ marginTop: '12px' }} matchStatus={positionState.status}>
							<span>{positionState?.status}</span>
						</PSC.TicketStatus>
					</SC.BlackBox>
				)}
			</SC.ColCenteredVertically>
		</SC.PositionListItem>
	)
}

export default PositionListItem
