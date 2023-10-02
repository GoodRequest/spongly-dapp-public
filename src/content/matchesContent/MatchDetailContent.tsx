import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next-translate-routes'
import { toNumber } from 'lodash'
import BackButton from '@/atoms/backButton/BackButton'
import { PAGES, SWITCH_BUTTON_OPTIONS } from '@/utils/enums'
import * as SC from './MatchDetailContentStyles'
import SwitchButton from '@/components/switchButton/SwitchButton'
import { GET_MATCH_DETAIL } from '@/utils/queries'
import { getTeamImageSource } from '@/utils/images'
import { MSG_TYPE, NO_TEAM_IMAGE_FALLBACK, NOTIFICATION_TYPE } from '@/utils/constants'
import { showNotifications } from '@/utils/tsxHelpers'
import { useIsMounted } from '@/hooks/useIsMounted'

const MatchDetail = (props: any) => {
	// TODO: Match detail
	const { t } = useTranslation()
	const router = useRouter()
	const [tab, setTab] = useState(SWITCH_BUTTON_OPTIONS.OPTION_1)
	const [matchDetailData, setMatchDetailData] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const isMounted = useIsMounted()
	const onChangeSwitch = (option: SWITCH_BUTTON_OPTIONS) => {
		setTab(option)
	}
	console.log('matchDetailData', matchDetailData)
	const [fetchMatchDetail] = useLazyQuery(GET_MATCH_DETAIL)
	const fetchData = () => {
		setLoading(true)
		setTimeout(() => {
			fetchMatchDetail({
				variables: {
					id: router.query.id
				}
			})
				.then((res) => {
					setMatchDetailData(res.data.sportMarket)
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error('eerrr', { e })
					showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while loading detail of match') }], NOTIFICATION_TYPE.NOTIFICATION)
				})
				.finally(() => {
					setLoading(false)
				})
		}, 500)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])
	return (
		<Row gutter={30}>
			<Col span={24}>
				<BackButton backUrl={`/${PAGES.MATCHES}`} />
			</Col>
			{loading && isMounted && !matchDetailData ? (
				// TODO: zistit preco nejde loading empty state
				<div>laoding</div>
			) : (
				<SC.MatchDetailWrapper>
					<SC.MatchDetailHeader>
						<Row gutter={[16, 16]}>
							<SC.HeaderCol span={12}>
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
							<div
								style={{
									background: 'red',
									position: 'absolute'
								}}
							>
								test
							</div>
							<SC.HeaderCol span={12}>
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
						</Row>
					</SC.MatchDetailHeader>
					<SwitchButton option1={t('Positions')} option2={t('Stats')} onClick={onChangeSwitch} />
					{SWITCH_BUTTON_OPTIONS.OPTION_1 === tab && <h1>{'Positions'}</h1>}
					{SWITCH_BUTTON_OPTIONS.OPTION_2 === tab && <h1>{'Stats'}</h1>}
				</SC.MatchDetailWrapper>
			)}
		</Row>
	)
}

export default MatchDetail
