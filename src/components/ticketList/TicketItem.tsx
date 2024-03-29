import React, { useEffect, useState } from 'react'
import { toNumber } from 'lodash'
import { Col, Row, Spin, Tooltip } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { LoadingOutlined } from '@ant-design/icons'

// utils
import { useRouter } from 'next-translate-routes'
import { getTeamImageSource } from '@/utils/images'
import { getHandicapValue, getParlayItemStatus, isWindowReady } from '@/utils/helpers'
import { SPORTS_MAP } from '@/utils/tags'
import { convertPositionNameToPosition, getMatchOddsContract, getSymbolText } from '@/utils/markets'
import networkConnector from '@/utils/networkConnector'
import { Position } from '@/__generated__/resolvers-types'
import { NO_TEAM_IMAGE_FALLBACK, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { roundToTwoDecimals } from '@/utils/formatters/number'
import { PAGES } from '@/utils/enums'

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
	const router = useRouter()
	const oddsSymbol = oddsInfo?.isCombined ? oddsInfo?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(match.side), match.market)
	const isTotalWinner = match.market?.tags && TOTAL_WINNER_TAGS.includes(match.market.tags?.[0])
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

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

	useEffect(() => {
		fetchOddsData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isPlayedNow = () => {
		if (oddsDataFromContract) {
			if (match.market.isOpen && getMatchOddsContract(match.side, oddsDataFromContract) === '0' && !match.market.isPaused) {
				return true
			}
		}

		return false
	}

	const getOdds = () => {
		if (oddsInfo?.isCombined) {
			return oddsInfo?.quote
		}

		if (oddsInfo.isParlay) {
			return formatParlayQuote(Number(oddsInfo.quote), actualOddType)
		}

		if (!oddsInfo.isParlay) {
			return formatPositionOdds(match, actualOddType)
		}

		// rather show nothing then wrong odds
		return ''
	}

	// Extra values number for bet info (H1 / H2, U / T)
	const betInfoValues = () => {
		if (match.market.spread) {
			return `(${getHandicapValue(Number(match.market.spread) || 0, oddsSymbol as any)})`
		}
		if (match.market.total) {
			return `(${roundToTwoDecimals(Number(match.market.total) || 0)})`
		}
		return ''
	}
	return (
		<SC.TicketItemWrapper onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.market.gameId}`)}>
			<SC.TicketHeader>
				<SC.SportLogo>
					<Icon style={{ marginRight: 0, color: 'white' }} className={`icon icon--${SPORTS_MAP[Number(match?.market.tags?.[0])]?.toLowerCase()}`} />
				</SC.SportLogo>
				<SC.TicketStatus style={{ height: 32 }} matchStatus={getParlayItemStatus(match, isPlayedNow(), t).status}>
					<span>{getParlayItemStatus(match, isPlayedNow(), t).text}</span>
				</SC.TicketStatus>
			</SC.TicketHeader>
			<Row gutter={8} align={'middle'}>
				<Col xxl={5} xl={5} lg={5} md={3} sm={4} xs={7}>
					<SCS.MatchIcon>
						<img
							src={getTeamImageSource(match?.market.homeTeam || '', toNumber(match?.market.tags?.[0]))}
							onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
								e.target.src = NO_TEAM_IMAGE_FALLBACK
							}}
						/>
					</SCS.MatchIcon>
					{!isTotalWinner && (
						<SCS.MatchIcon>
							<img
								src={getTeamImageSource(match?.market.awayTeam || '', toNumber(match?.market.tags?.[0]))}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SCS.MatchIcon>
					)}
				</Col>
				<Col xxl={11} xl={11} lg={10} md={16} sm={14} xs={16}>
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
				<SC.OddsWrapper xxl={8} xl={8} lg={9} md={5} sm={6} xs={24}>
					{oddsSymbol ? (
						<SC.BetTypeText>{`${oddsSymbol} ${betInfoValues()}`}</SC.BetTypeText>
					) : (
						<Tooltip title={t('Unknown bet type - this bet will not be copied.')}>
							<SC.BetTypeText>{`-`}</SC.BetTypeText>
						</Tooltip>
					)}

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
