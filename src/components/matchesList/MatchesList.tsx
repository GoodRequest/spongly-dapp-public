import React, { FC, useState, useEffect, useMemo } from 'react'
import { Col, Row } from 'antd'
import { groupBy, includes, map, slice, toPairs } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'

import Flag from 'react-world-flags'
import MatchListItem from './MatchesListItem'
import ArrowIcon from '@/assets/icons/arrow-down.svg'

import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'

import { SportMarket } from '@/__generated__/resolvers-types'
import { BetType } from '@/utils/tags'
import { useMedia } from '@/hooks/useMedia'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { SGPItem } from '@/typescript/types'
import { MATCHES_OFFSET, MATCHES_OFFSET_MOBILE, Network, STATIC } from '@/utils/constants'
import Modal from '@/components/modal/Modal'
import { RESOLUTIONS } from '@/utils/enums'
import { FlagWorld } from '@/styles/GlobalStyles'

interface IMatchesList {
	matches: SportMarket[]
	filter: any
	loading: boolean
	item: any
}

const MatchesList: FC<IMatchesList> = ({ matches, filter, item }) => {
	const { chain } = useNetwork()
	const { t } = useTranslation()
	const size = useMedia()
	const [sgpFees, setSgpFees] = useState<SGPItem[]>()
	const [visibleParlayValidationModal, setVisibleParlayValidationModal] = useState({ visible: false, message: '' })
	const [matchOffsetByResolution, setMatchOffsetByResolution] = useState(0)

	useEffect(() => {
		if (includes([RESOLUTIONS.SM, RESOLUTIONS.MD], size)) {
			setMatchOffsetByResolution(MATCHES_OFFSET_MOBILE)
		} else {
			setMatchOffsetByResolution(MATCHES_OFFSET)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	const matchesWithChildMarkets = useMemo(
		() =>
			toPairs(groupBy(matches, 'gameId'))
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
				.filter((item) => item.winnerTypeMatch),
		[matches, sgpFees]
	)

	const [renderList, setRenderList] = useState<any>([])
	const [hasMore, setHasMore] = useState(matchesWithChildMarkets?.length > matchOffsetByResolution)

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	useEffect(() => {
		setRenderList(slice(matchesWithChildMarkets, 0, matchOffsetByResolution))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sgpFees, matchOffsetByResolution])

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
			if (renderList.length < matchesWithChildMarkets.length && renderList.length + matchOffsetByResolution < matchesWithChildMarkets.length) {
				setRenderList([...renderList, ...slice(matchesWithChildMarkets, renderList.length, renderList.length + matchOffsetByResolution)])
			}
			if (renderList.length < matchesWithChildMarkets.length && renderList.length + matchOffsetByResolution >= matchesWithChildMarkets.length) {
				setRenderList([...matchesWithChildMarkets])
			}
		}
	}

	const modalParlayValidation = useMemo(
		() => (
			<Modal
				open={visibleParlayValidationModal.visible}
				onCancel={() => {
					setVisibleParlayValidationModal({ visible: false, message: '' })
				}}
				title={t('Parlay Validation')}
				centered
			>
				<SC.ModalDescriptionText>{visibleParlayValidationModal.message}</SC.ModalDescriptionText>
			</Modal>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[visibleParlayValidationModal]
	)

	// NOTE if sport exist in league show league header and match list if not show anything (do not use empty state because it is necessary)
	return renderList.length > 0 ? (
		<SC.MatchListWrapper>
			<Row>
				<Col span={24}>
					{/* NOTE: if has no items, should be filtered out, so renderList list must be loading. */}
					<SC.LeagueHeader>
						{item?.country && item?.country !== STATIC.WORLD && (
							<SC.FlagWrapper>
								<Flag code={item.country} />
							</SC.FlagWrapper>
						)}

						{item?.country && item?.country === STATIC.WORLD && <FlagWorld />}
						{item?.label}
					</SC.LeagueHeader>
					{map(renderList, (match, key) => (
						<MatchListItem
							match={match}
							keyValue={`match-${match.address}-${key}`}
							filter={filter}
							setVisibleParlayValidationModal={setVisibleParlayValidationModal}
						/>
					))}

					{hasMore && renderList.length !== 0 && (
						<SC.LoadMore onClick={addMatchesToList}>
							{t('Show more')}
							<SCS.Icon icon={ArrowIcon} />
						</SC.LoadMore>
					)}
				</Col>
			</Row>
			{modalParlayValidation}
		</SC.MatchListWrapper>
	) : null
}

export default MatchesList
