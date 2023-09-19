import React, { useEffect, useState } from 'react'
import { toNumber } from 'lodash'
import { Spin, Row, Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { LoadingOutlined } from '@ant-design/icons'

// utils
import { getTeamImageSource } from '@/utils/images'
import { getParlayItemStatus } from '@/utils/helpers'
import { SPORTS_MAP } from '@/utils/tags'
import { convertPositionNameToPosition, getMatchOddsContract, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'
import { Position } from '@/__generated__/resolvers-types'
import { NO_TEAM_IMAGE_FALLBACK, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { RESULT_TYPE } from '@/utils/enums'
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'

// styles
import * as SC from './TicketItemStyles'
import { Icon } from '@/styles/Icons'
import * as SCS from '@/styles/GlobalStyles'

type Props = {
	match: Position
	oddsInfo: {
		quote?: number
		isParlay: boolean
		isCombined?: boolean
		combinedPositionsText?: string
	}
}

const TicketItem = ({ match, oddsInfo }: Props) => {
	const { sportsAMMContract } = networkConnector
	const { t } = useTranslation()
	const [oddsDataFromContract, setOddsDataFromContract] = useState()

	const oddsSymbol = oddsInfo?.isCombined ? oddsInfo?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(match.side), match.market)
	const isTotalWinner = match.market?.tags && TOTAL_WINNER_TAGS.includes(match.market.tags?.[0])
	const fetchOddsData = async () => {
		try {
			const data = await sportsAMMContract?.getMarketDefaultOdds(match.market.address, false)
			// TODO: add marketLiquidityAndPriceImpact and bonus
			// const marketLiquidityAndPriceImpact = await sportsAMMContract?.buyPriceImpact(match.market.address)
			// const buyBonus = convertPriceImpactToBonus(bigNumberFormatter(marketLiquidityAndPriceImpact.homePriceImpact))
			setOddsDataFromContract(data)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('error', error)
		}
	}

	const isFinished = !match.market.isOpen && match.market.isResolved && !match.market.isCanceled

	useEffect(() => {
		fetchOddsData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isPlayedNow = () => {
		if (oddsDataFromContract) {
			if (match.market.isOpen && getMatchOddsContract(match.side, oddsDataFromContract) === '0') return true
		}

		return false
	}

	const getOdds = () => {
		if (oddsInfo?.isCombined) {
			return oddsInfo?.quote
		}

		if (oddsInfo.isParlay) {
			return formatParlayQuote(Number(oddsInfo.quote))
		}

		if (!oddsInfo.isParlay) {
			return formatPositionOdds(match)
		}

		// rather show nothing then wrong odds
		return ''
	}

	const getTicketResults = () => {
		if (match.market?.tags && isTotalWinner) {
			if (match.market.homeScore === RESULT_TYPE.WINNER) return t('Winner')
			return t('No win')
		}
		return <span>{`${match.market.homeScore || '?'} : ${match.market.awayScore || '?'}`}</span>
	}

	return (
		<SC.TicketItemWrapper>
			<SC.TicketHeader>
				<SC.SportLogo>
					<Icon style={{ marginRight: 0, color: 'white' }} className={`icon icon--${SPORTS_MAP[Number(match?.market.tags?.[0])]?.toLowerCase()}`} />
				</SC.SportLogo>
				<SC.TicketStatus matchStatus={getParlayItemStatus(match, isPlayedNow(), t).status}>
					<span>{getParlayItemStatus(match, isPlayedNow(), t).text}</span>
				</SC.TicketStatus>
			</SC.TicketHeader>
			<Row gutter={8}>
				<Col xxl={6} xl={6} lg={6} md={4} sm={4} xs={7}>
					<SC.MatchIcon>
						<img
							src={getTeamImageSource(match?.market.homeTeam || '', toNumber(match?.market.tags?.[0]))}
							onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
								e.target.src = NO_TEAM_IMAGE_FALLBACK
							}}
						/>
					</SC.MatchIcon>
					{!isTotalWinner && (
						<SC.MatchIcon>
							<img
								src={getTeamImageSource(match?.market.awayTeam || '', toNumber(match?.market.tags?.[0]))}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SC.MatchIcon>
					)}
				</Col>
				<Col xxl={14} xl={12} lg={14} md={16} sm={18} xs={16}>
					<SCS.EllipsisText
						ellipsis={{
							rows: 1
						}}
						title={match.market.homeTeam}
					>
						{match.market.homeTeam}
					</SCS.EllipsisText>
					{!isTotalWinner && (
						<SCS.EllipsisText
							ellipsis={{
								rows: 1
							}}
							title={match.market.awayTeam}
						>
							{match.market.awayTeam}
						</SCS.EllipsisText>
					)}
				</Col>
				{isFinished && (
					<SC.ResultsWrapper md={{ span: 2, order: 2 }} sm={{ span: 12, order: 3 }} xs={{ span: 12, order: 3 }}>
						{getTicketResults()}
					</SC.ResultsWrapper>
				)}
				<SC.OddsWrapper md={{ span: 4, order: 3 }} sm={{ span: 12, order: 2 }} xs={{ span: 12, order: 2 }}>
					<SC.TeamText>{oddsSymbol}</SC.TeamText>
					{oddsDataFromContract ? (
						<SCS.FlexColumn>
							<SC.OddText>{getOdds()}</SC.OddText>
						</SCS.FlexColumn>
					) : (
						<Spin indicator={<LoadingOutlined spin />} />
					)}
				</SC.OddsWrapper>
			</Row>
		</SC.TicketItemWrapper>
	)
}

export default TicketItem
