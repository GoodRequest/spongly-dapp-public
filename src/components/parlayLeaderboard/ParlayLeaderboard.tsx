import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next-translate-routes'

import ParlayLeaderboardRow from './components/ParlayLeaderboardRow'
import { ParlayLeaderboardItem } from '@/typescript/types'
import { getReq } from '@/utils/requests'
import { getCurrentBiweeklyPeriod, getReward, handleErrorMessage } from '@/utils/helpers'
import { ENDPOINTS, ErrorNotificationTypes, NETWORK_IDS, OddsType } from '@/utils/constants'

import * as SC from './ParlayLeaderboardStyles'
import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import { formatQuote } from '@/utils/formatters/quote'

const ParlayLeaderboard = () => {
	const { t } = useTranslation()
	const router = useRouter()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [parlayLeaderboardData, setParlayLeaderboardData] = useState<ParlayLeaderboardItem[] | undefined>(undefined)

	const { chain } = useNetwork()

	const loadLeaderboard = async () => {
		try {
			setIsLoading(true)
			const { data } = await getReq(t, ENDPOINTS.GET_PARLAY_LEADERBOARD(chain?.id || NETWORK_IDS.OPTIMISM, getCurrentBiweeklyPeriod()))
			const newParlayData: ParlayLeaderboardItem[] = []
			if (data) {
				for (let i = 0; i < 3; i += 1) {
					if (data?.[i]) {
						const newItem: ParlayLeaderboardItem = {
							rank: data?.[i]?.rank,
							address: data?.[i]?.account,
							position: data?.[i]?.numberOfPositions,
							quote: data?.[i]?.totalQuote ? Number(formatQuote(OddsType.DECIMAL, data?.[i]?.totalQuote)) : 0,
							reward: getReward(i, chain?.id)
						}
						newParlayData.push(newItem)
					} else {
						break
					}
				}
			}
			setParlayLeaderboardData(newParlayData)
		} catch (e) {
			handleErrorMessage(ErrorNotificationTypes.PARLAY_LEADERBOARD, t)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadLeaderboard()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id])

	// TODO: we do not have empty state in figma atm.
	const parlayLeaderBoard = () => {
		if (parlayLeaderboardData?.length === 0) {
			return (
				<SC.Empty
					image={EmptyStateImage}
					imageStyle={{ height: 70 }}
					description={
						<div>
							<span>{t('There are no superstars in current biweekly period')}</span>
						</div>
					}
				/>
			)
		}
		return parlayLeaderboardData?.map((data, index) => (
			<ParlayLeaderboardRow key={index} rank={data.rank} address={data.address} position={data.position} quote={data.quote} reward={data?.reward} />
		))
	}

	return (
		<SC.ParlayLeaderboardWrapper>
			<SC.ParlayLeaderboardRow>
				<Col span={24}>
					<SC.ParlayLeaderboardHeader>{t('Parlay Superstars')}</SC.ParlayLeaderboardHeader>
				</Col>
			</SC.ParlayLeaderboardRow>
			{!(parlayLeaderboardData?.length === 0) && (
				<Row>
					<Col span={9}>
						<SC.ParlayLeaderboardTableTitle>{t('Rank')}</SC.ParlayLeaderboardTableTitle>
					</Col>
					<SC.CenterRowContent span={5}>
						<SC.ParlayLeaderboardTableTitle>{t('Position')}</SC.ParlayLeaderboardTableTitle>
					</SC.CenterRowContent>
					<SC.CenterRowContent span={5}>
						<SC.ParlayLeaderboardTableTitle>{t('Quote')}</SC.ParlayLeaderboardTableTitle>
					</SC.CenterRowContent>
					<SC.CenterRowContent span={5}>
						<SC.ParlayLeaderboardTableTitle>{t('Reward')}</SC.ParlayLeaderboardTableTitle>
					</SC.CenterRowContent>
				</Row>
			)}
			<div style={{ minHeight: '200px' }}>{!isLoading ? parlayLeaderBoard() : <SC.Skeleton paragraph={{ rows: 4 }} />}</div>
			<SC.LeaderboardButton type={'primary'} onClick={() => router.push('/parlay-leaderboard')}>
				{t('Show more')}
			</SC.LeaderboardButton>
		</SC.ParlayLeaderboardWrapper>
	)
}

export default ParlayLeaderboard
