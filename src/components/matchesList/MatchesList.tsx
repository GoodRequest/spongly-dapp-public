import React, { FC, useState, useEffect, useMemo } from 'react'
import { Col, Row } from 'antd'
import { includes, map, slice } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import Flag from 'react-world-flags'

// types
import { SportMarket } from '@/__generated__/resolvers-types'
import { SGPItem } from '@/typescript/types'

// hooks
import { useMedia } from '@/hooks/useMedia'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'
import { useMatchesWithChildMarkets } from '@/hooks/useMatchesWithChildMarkets'

// utils
import { RESOLUTIONS } from '@/utils/enums'
import { MATCHES_OFFSET, MATCHES_OFFSET_MOBILE, Network, NETWORK_IDS, STATIC } from '@/utils/constants'

// components
import MatchListItem from './MatchesListItem'
import Modal from '@/components/modal/Modal'

import ArrowIcon from '@/assets/icons/arrow-down.svg'

import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'
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
	const matchesWithChildMarkets = useMatchesWithChildMarkets(matches, sgpFees, true)

	useEffect(() => {
		if (includes([RESOLUTIONS.SM, RESOLUTIONS.MD], size)) {
			setMatchOffsetByResolution(MATCHES_OFFSET_MOBILE)
		} else {
			setMatchOffsetByResolution(MATCHES_OFFSET)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const sgpFeesRaw = useSGPFeesQuery((chain?.id as Network) || NETWORK_IDS.OPTIMISM, {
		enabled: true
	})

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
	}, [sgpFees, matchOffsetByResolution, matchesWithChildMarkets])

	useEffect(() => {
		if (renderList?.length < matchesWithChildMarkets?.length) {
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
						{item?.country && item?.country !== STATIC.WORLD && <SC.FlagWrapper code={item.country} />}
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
