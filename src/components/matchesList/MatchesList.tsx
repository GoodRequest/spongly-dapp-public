import { FC, useState, useEffect } from 'react'
import { Col, Row } from 'antd'
import { groupBy, map, slice, toPairs } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'

import MatchListItem from './MatchesListItem'
import ArrowIcon from '@/assets/icons/arrow-down.svg'

import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'

import { SportMarket } from '@/__generated__/resolvers-types'
import { BetType } from '@/utils/tags'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { SGPItem } from '@/typescript/types'
import { MATCHES_OFFSET } from '@/utils/constants'

interface IMatchesList {
	matches: SportMarket[]
	filter: any
	loading: boolean
}

const MatchesList: FC<IMatchesList> = ({ matches, filter, loading }) => {
	const { chain } = useNetwork()
	const { t } = useTranslation()
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as any, {
		enabled: !!chain?.id
	})

	const matchesWithChildMarkets = toPairs(groupBy(matches, 'gameId'))
		.map(([, markets]) => {
			const [match] = markets
			const winnerTypeMatch = markets.find((market) => Number(market.betType) === BetType.WINNER)
			const doubleChanceTypeMatches = markets.filter((market) => Number(market.betType) === BetType.DOUBLE_CHANCE)
			const spreadTypeMatch = markets.find((market) => Number(market.betType) === BetType.SPREAD)
			const totalTypeMatch = markets.find((market) => Number(market.betType) === BetType.TOTAL)
			const combinedTypeMatch = sgpFees?.find((item) => item.tags.includes(Number(match?.tags?.[0])))
			return {
				...(winnerTypeMatch ?? matches.find((item) => item.gameId === match?.gameId)),
				winnerTypeMatch,
				doubleChanceTypeMatches,
				spreadTypeMatch,
				totalTypeMatch,
				combinedTypeMatch
			}
		}) // NOTE: remove broken results.
		.filter((item) => item.winnerTypeMatch)

	const [renderList, setRenderList] = useState<any>([])
	const [hasMore, setHasMore] = useState(matchesWithChildMarkets?.length > MATCHES_OFFSET)

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	useEffect(() => {
		setRenderList(slice(matchesWithChildMarkets, 0, MATCHES_OFFSET))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sgpFees])

	useEffect(() => {
		if (renderList?.length < matchesWithChildMarkets.length) {
			setHasMore(true)
		} else {
			setHasMore(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderList])

	const addMatchesToList = () => {
		if (hasMore) {
			if (renderList.length < matchesWithChildMarkets.length && renderList.length + MATCHES_OFFSET < matchesWithChildMarkets.length) {
				setRenderList([...renderList, ...slice(matchesWithChildMarkets, renderList.length, renderList.length + MATCHES_OFFSET)])
			}
			if (renderList.length < matchesWithChildMarkets.length && renderList.length + MATCHES_OFFSET >= matchesWithChildMarkets.length) {
				setRenderList([...matchesWithChildMarkets])
			}
		}
	}

	return (
		<SC.MatchListWrapper>
			<Row>
				<Col span={24}>
					{loading ? (
						<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					) : (
						<>
							{renderList.length > 0 ? (
								map(renderList, (match, key) => <MatchListItem match={match} keyValue={`match-${match.address}-${key}`} filter={filter} />)
							) : (
								<SC.MatchItemEmptyState>
									<Row>
										<Col md={{ span: 5 }} xs={{ span: 0 }}>
											<SC.EmptyImage />
										</Col>
										<Col md={{ span: 19 }} xs={{ span: 24 }}>
											<h4>{t('There are currently no matches being played')}</h4>
											<p>{t('You can try other leagues')}</p>
										</Col>
									</Row>
								</SC.MatchItemEmptyState>
							)}
							{hasMore && (
								<SC.LoadMore onClick={addMatchesToList}>
									<SCS.Icon icon={ArrowIcon} />
									<span>{t('Show more')}</span>
								</SC.LoadMore>
							)}
						</>
					)}
				</Col>
			</Row>
		</SC.MatchListWrapper>
	)
}

export default MatchesList
