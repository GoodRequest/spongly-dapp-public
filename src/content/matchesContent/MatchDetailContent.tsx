import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import React, { useCallback, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next-translate-routes'
import { groupBy, toNumber, toPairs } from 'lodash'
import { useNetwork } from 'wagmi'

import { RESOLUTIONS, SWITCH_BUTTON_OPTIONS, TEAM_TYPE } from '@/utils/enums'
import * as SC from './MatchDetailContentStyles'
import * as SCS from '@/styles/GlobalStyles'
import SwitchButton from '@/components/switchButton/SwitchButton'
import { GET_MATCH_DETAIL } from '@/utils/queries'
import { getTeamImageSource } from '@/utils/images'
import { MSG_TYPE, NETWORK_IDS, NO_TEAM_IMAGE_FALLBACK, NOTIFICATION_TYPE, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'
import { getMatchResult, getMatchDetailScoreText, getMatchStatus, isAboveOrEqualResolution, isBellowOrEqualResolution } from '@/utils/helpers'
import { BetType, TAGS_LIST } from '@/utils/tags'
import MatchListContent from '@/components/matchesList/MatchListContent'
import { getMarketOddsFromContract } from '@/utils/markets'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import Custom404 from '@/pages/404'
import { useMedia } from '@/hooks/useMedia'

const MatchDetail = () => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const networkId = chain?.id || NETWORK_IDS.OPTIMISM
	const router = useRouter()
	const [tab, setTab] = useState(SWITCH_BUTTON_OPTIONS.OPTION_1)
	const [matchDetailData, setMatchDetailData] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const size = useMedia()
	const [error, setError] = useState(false)
	const isTotalWinner = matchDetailData?.tags && TOTAL_WINNER_TAGS.includes(matchDetailData.tags?.[0])
	const onChangeSwitch = (option: SWITCH_BUTTON_OPTIONS) => {
		setTab(option)
	}
	const [fetchMatchDetail] = useLazyQuery(GET_MATCH_DETAIL)
	const sgpFeesRaw = useSGPFeesQuery(networkId, {
		enabled: true
	})

	const fetchData = useCallback(async () => {
		setLoading(true)
		try {
			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate a delay
			const res = await fetchMatchDetail({
				variables: {
					gameId: router.query.id
				},
				context: { chainId: networkId }
			})
			const league = TAGS_LIST.find((item) => item.id === Number(res.data.sportMarkets[0].tags[0]))
			const matches = await getMarketOddsFromContract(res?.data?.sportMarkets, networkId)
			const matchesWithChildMarkets = toPairs(groupBy(matches, 'gameId'))
				.map(([, markets]) => {
					const [match] = markets
					const winnerTypeMatch = markets.find((market) => Number(market.betType) === BetType.WINNER)
					const doubleChanceTypeMatches = markets.filter((market) => Number(market.betType) === BetType.DOUBLE_CHANCE)
					// NOTE: filter paused spread and total bet types (bet types with isPaused = true adn 0 odds).
					// TODO: maybe we show those options in future (need refactor find to filter and remove && !market.isPaused)
					const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD && !market.isPaused)
					const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL && !market.isPaused)

					const combinedTypeMatch = sgpFeesRaw.data?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
					return {
						...(winnerTypeMatch ?? matches.find((item: any) => item.gameId === match?.gameId)),
						winnerTypeMatch,
						doubleChanceTypeMatches,
						spreadTypeMatch,
						totalTypeMatch,
						combinedTypeMatch
					}
				}) // NOTE: remove broken results.
				.filter((item) => item.winnerTypeMatch)
			setMatchDetailData({ ...matchesWithChildMarkets[0], league, status: getMatchStatus(matchesWithChildMarkets[0], t).status })
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
			setError(true)
			setMatchDetailData(null)
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading detail of match') }], NOTIFICATION_TYPE.NOTIFICATION)
		} finally {
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id, sgpFeesRaw.data, t])

	useEffect(() => {
		if (router.isReady) {
			fetchData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady])

	const renderMatchDetail =
		!matchDetailData || loading ? (
			<SC.RowSkeleton active loading paragraph={{ rows: 10 }} />
		) : (
			matchDetailData &&
			!loading && (
				<>
					<SC.MatchDetailHeader>
						<Row justify={'center'}>
							<SC.HeaderCol result={getMatchResult(matchDetailData)} team={TEAM_TYPE.HOME_TEAM} span={isTotalWinner ? 12 : 8}>
								<SC.MatchIcon>
									<img
										src={getTeamImageSource(matchDetailData?.homeTeam || '', toNumber(matchDetailData?.tags?.[0]))}
										onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
											e.target.src = NO_TEAM_IMAGE_FALLBACK
										}}
									/>
								</SC.MatchIcon>
								<SC.HeaderTeam>{matchDetailData?.homeTeam}</SC.HeaderTeam>
							</SC.HeaderCol>
							<SC.HeaderCol span={isTotalWinner ? 12 : 8}>
								<SCS.LeagueIcon className={matchDetailData?.league?.logoClass} />
								<SC.HeaderResultText>{getMatchDetailScoreText(matchDetailData, t, isTotalWinner)}</SC.HeaderResultText>
								{isAboveOrEqualResolution(size, RESOLUTIONS.LG) && (
									<SC.HeaderStatus matchStatus={getMatchStatus(matchDetailData, t).status}>
										<span>{getMatchStatus(matchDetailData, t).text}</span>
									</SC.HeaderStatus>
								)}
							</SC.HeaderCol>
							{!isTotalWinner && (
								<SC.HeaderCol result={getMatchResult(matchDetailData)} team={TEAM_TYPE.AWAY_TEAM} span={8}>
									<SC.MatchIcon>
										<img
											src={getTeamImageSource(matchDetailData?.awayTeam || '', toNumber(matchDetailData?.tags?.[0]))}
											onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
												e.target.src = NO_TEAM_IMAGE_FALLBACK
											}}
										/>
									</SC.MatchIcon>
									<SC.HeaderTeam>{matchDetailData?.awayTeam}</SC.HeaderTeam>
								</SC.HeaderCol>
							)}
							{isBellowOrEqualResolution(size, RESOLUTIONS.MD) && (
								<Col span={24} md={6}>
									<SC.HeaderStatus matchStatus={getMatchStatus(matchDetailData, t).status}>
										<span>{getMatchStatus(matchDetailData, t).text}</span>
									</SC.HeaderStatus>
								</Col>
							)}
							<Col span={24} md={0}>
								<SC.Separator />
							</Col>
						</Row>
					</SC.MatchDetailHeader>
					<SwitchButton option1={t('Positions')} option2={t('Stats')} onClick={onChangeSwitch} />
					{SWITCH_BUTTON_OPTIONS.OPTION_1 === tab && matchDetailData && <MatchListContent match={matchDetailData} />}
					{/* // TODO: stats */}
					{/* {SWITCH_BUTTON_OPTIONS.OPTION_2 === tab && <h1>{'Stats'}</h1>} */}
				</>
			)
		)
	return <SC.MatchDetailWrapper>{error ? <Custom404 /> : renderMatchDetail}</SC.MatchDetailWrapper>
}

export default MatchDetail
