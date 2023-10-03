import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next-translate-routes'
import { groupBy, toNumber, toPairs } from 'lodash'

import BackButton from '@/atoms/backButton/BackButton'
import { PAGES, SWITCH_BUTTON_OPTIONS, TEAM_TYPE } from '@/utils/enums'
import * as SC from './MatchDetailContentStyles'
import * as SCS from '@/styles/GlobalStyles'
import SwitchButton from '@/components/switchButton/SwitchButton'
import { GET_MATCH_DETAIL } from '@/utils/queries'
import { getTeamImageSource } from '@/utils/images'
import { MSG_TYPE, NO_TEAM_IMAGE_FALLBACK, NOTIFICATION_TYPE, STABLE_DECIMALS } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'
import { getMatchResult, getMatchStatus } from '@/utils/helpers'
import { BetType, TAGS_LIST } from '@/utils/tags'
import MatchListContent from '@/components/matchesList/MatchListContent'
import { getMarketOddsFromContract } from '@/utils/markets'
import { bigNumberFormmaterWithDecimals } from '@/utils/formatters/ethers'

const MatchDetail = () => {
	// TODO: Match detail
	const { t } = useTranslation()
	const router = useRouter()
	const [tab, setTab] = useState(SWITCH_BUTTON_OPTIONS.OPTION_1)
	const [matchDetailData, setMatchDetailData] = useState<any>(null)
	const onChangeSwitch = (option: SWITCH_BUTTON_OPTIONS) => {
		setTab(option)
	}
	const [fetchMatchDetail] = useLazyQuery(GET_MATCH_DETAIL)
	const fetchData = () => {
		setTimeout(() => {
			fetchMatchDetail({
				variables: {
					gameId: router.query.id
				}
			})
				.then((res) => {
					const league = TAGS_LIST.find((item) => item.id === Number(res.data.sportMarkets[0].tags[0]))
					getMarketOddsFromContract(res?.data?.sportMarkets).then((matches) => {
						const matchesWithChildMarkets = toPairs(groupBy(matches, 'gameId'))
							.map(([, markets]) => {
								const [match] = markets
								const winnerTypeMatch = markets.find((market) => Number(market.betType) === BetType.WINNER)
								const doubleChanceTypeMatches = markets.filter((market) => Number(market.betType) === BetType.DOUBLE_CHANCE)
								const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD)
								const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL)
								// TODO:
								// const combinedTypeMatch = sgpFees?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
								return {
									...(winnerTypeMatch ?? matches.find((item: any) => item.gameId === match?.gameId)),
									winnerTypeMatch,
									doubleChanceTypeMatches,
									spreadTypeMatch,
									totalTypeMatch
									// TODO: combined
									// combinedTypeMatch
								}
							}) // NOTE: remove broken results.
							.filter((item) => item.winnerTypeMatch)
						setMatchDetailData({ ...matchesWithChildMarkets[0], league, status: getMatchStatus(matchesWithChildMarkets[0], t).status })
					})
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e)
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading detail of match') }], NOTIFICATION_TYPE.NOTIFICATION)
				})
		}, 500)
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<Row gutter={30}>
			<Col span={24}>
				<BackButton backUrl={`/${PAGES.MATCHES}`} />
			</Col>
			<SC.MatchDetailWrapper>
				{!matchDetailData ? (
					<SC.RowSkeleton active loading paragraph={{ rows: 10 }} />
				) : (
					<>
						<SC.MatchDetailHeader>
							<Row justify={'center'}>
								<SC.HeaderCol span={8} order={2} md={{ order: 1 }}>
									<SC.MatchIcon result={getMatchResult(matchDetailData)} team={TEAM_TYPE.HOME_TEAM}>
										<img
											src={getTeamImageSource(matchDetailData?.homeTeam || '', toNumber(matchDetailData?.tags?.[0]))}
											onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
												e.target.src = NO_TEAM_IMAGE_FALLBACK
											}}
										/>
									</SC.MatchIcon>
									<SC.HeaderTeam>{matchDetailData?.homeTeam}</SC.HeaderTeam>
								</SC.HeaderCol>
								<SC.HeaderCol span={8} order={3} md={{ order: 2 }}>
									<SCS.LeagueIcon className={matchDetailData.league.logoClass} />
									<SC.HeaderVersusText>VS</SC.HeaderVersusText>
								</SC.HeaderCol>
								<SC.HeaderCol span={8} order={3} md={{ order: 3 }}>
									<SC.MatchIcon result={getMatchResult(matchDetailData)} team={TEAM_TYPE.AWAY_TEAM}>
										<img
											src={getTeamImageSource(matchDetailData?.awayTeam || '', toNumber(matchDetailData?.tags?.[0]))}
											onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
												e.target.src = NO_TEAM_IMAGE_FALLBACK
											}}
										/>
									</SC.MatchIcon>
									<SC.HeaderTeam>{matchDetailData?.awayTeam}</SC.HeaderTeam>
								</SC.HeaderCol>
								<Col span={24} order={1} md={{ order: 4, span: 6 }}>
									<SC.HeaderStatus matchStatus={getMatchStatus(matchDetailData, t).status}>
										<span>{getMatchStatus(matchDetailData, t).text}</span>
									</SC.HeaderStatus>
								</Col>
							</Row>
						</SC.MatchDetailHeader>
						<SwitchButton option1={t('Positions')} option2={t('Stats')} onClick={onChangeSwitch} />
						{SWITCH_BUTTON_OPTIONS.OPTION_1 === tab && matchDetailData && <MatchListContent match={matchDetailData} />}
						{/* // TODO: stats */}
						{/* {SWITCH_BUTTON_OPTIONS.OPTION_2 === tab && <h1>{'Stats'}</h1>} */}
					</>
				)}
			</SC.MatchDetailWrapper>
		</Row>
	)
}

export default MatchDetail
