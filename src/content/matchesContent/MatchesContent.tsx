import { memo, useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Row, Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { map, filter as lodashFilter, includes, find, toString, sortBy } from 'lodash'
import { useRouter } from 'next-translate-routes'
import Flag from 'react-world-flags'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { FlagWorld } from '@/styles/GlobalStyles'

// types
import { SportMarket } from '@/__generated__/resolvers-types'

// hooks
import { useMedia } from '@/hooks/useMedia'
import { useIsMounted } from '@/hooks/useIsMounted'

// atoms
import RadioButtons from '@/atoms/radioButtons/RadioButtons'
import Button from '@/atoms/button/Button'
import Select from '@/atoms/select/Select'

// components
import MatchFilter from '@/components/matchFilter/MatchFilter'
import MatchesList from '@/components/matchesList/MatchesList'

// utils
import { MATCHES, RESOLUTIONS } from '@/utils/enums'
import { STATIC } from '@/utils/constants'
import { BetType, SPORTS_TAGS_MAP, TAGS_LIST } from '@/utils/tags'

import * as SC from '../../layout/layout/LayoutStyles'
import * as SCS from './MatchesContentStyles'

import FilterIcon from '@/assets/icons/filter-icon.svg'
import { RootState } from '@/redux/rootReducer'
import { isBellowOrEqualResolution } from '@/utils/helpers'

interface ILeague {
	id: number
	open: SportMarket[]
	ongoing: SportMarket[]
	finished: SportMarket[]
	paused: SportMarket[]
}

interface IMatchFilter {
	status: MATCHES
	league: string
	sport: string
}

const MatchesContent = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const isMounted = useIsMounted()
	const size = useMedia()

	const [filter, setFilter] = useState<IMatchFilter>({
		status: MATCHES.OPEN,
		league: STATIC.ALL,
		sport: STATIC.ALL
	})

	const { data, isLoading, isFailure } = useSelector((state: RootState) => state.matches.matchesList)

	const [loading, setLoading] = useState(false)
	const [selectedSport, setSelectedSport] = useState(TAGS_LIST)
	const [allLeagues, setAllLeagues] = useState<ILeague[]>([])
	const [isFilterOpened, setFilterOpened] = useState(false)
	const [resultsCount, setResultsCount] = useState<number>(allLeagues?.length || 0)
	const [filtered, setFiltered] = useState({
		matches: allLeagues as ILeague[],
		sport: TAGS_LIST
	})

	const contentRef = useRef<HTMLDivElement>(null)

	const MATCHES_OPTIONS: Array<{ label: string; value: string }> = [
		{
			label: t('Open matches'),
			value: MATCHES.OPEN
		},
		{
			label: t('Ongoing'),
			value: MATCHES.ONGOING
		},
		{
			label: t('Finished'),
			value: MATCHES.FINISHED
		},
		{
			label: t('Paused / Canceled'),
			value: MATCHES.PAUSED
		}
	]

	const handleChange = (selectedValue: MATCHES) => {
		setFilter((currentFilter: any) => ({
			...currentFilter,
			status: selectedValue
		}))
	}

	const filterMatches = (filter: IMatchFilter): ILeague[] => {
		if (!includes([STATIC.ALL, undefined], filter.sport) || !includes([STATIC.ALL, undefined], filter.league)) {
			return lodashFilter(
				allLeagues,
				(item) =>
					includes(
						selectedSport.map((sport) => sport?.id),
						item.id
					) && item[filter.status].length > 0
			)
		}
		return allLeagues.filter((league) => league[filter.status].length > 0)
	}

	const filterLeagueMatches = (list: SportMarket[], league: number) => lodashFilter(list, (item) => toString(item?.tags?.[0]) === toString(league))

	const getResultsCount = (results: ILeague[]) => {
		return results.reduce((accumulator, currentValue) => accumulator + new Set(currentValue[filter.status].map((match) => match.gameId)).size, 0)
	}

	const mapMatchesByLeague = useMemo(
		() =>
			map(TAGS_LIST, (item) => ({
				id: item.id,
				list: filterLeagueMatches(data, item.id)
			})),
		[data]
	)

	// NOTE: this is heavy comuted function, look for optimalization if needed
	const mapMatchesByLeagueByStatus = useCallback(() => {
		if (data.length > 0) {
			const withStatusSeparation = map(mapMatchesByLeague, (item) => {
				return {
					id: item.id,
					[MATCHES.OPEN]: sortBy(
						lodashFilter(
							item.list,
							(item: SportMarket) =>
								item.isOpen &&
								!item.isPaused &&
								!item.isCanceled &&
								(Number(item.homeOdds) !== 0 ||
									Number(item.awayOdds) !== 0 ||
									(Number(item.drawOdds) || 0) !== 0 ||
									(item.betType && Number(item?.betType) === BetType.DOUBLE_CHANCE)) &&
								dayjs(Number(item.maturityDate) * 1000).isAfter(dayjs())
						),
						['maturityDate']
					),
					[MATCHES.ONGOING]: sortBy(
						lodashFilter(
							item.list,
							(item: SportMarket) => !item.isResolved && !item.isCanceled && dayjs(Number(item.maturityDate) * 1000).isBefore(dayjs())
						),
						['maturityDate']
					),
					[MATCHES.FINISHED]: sortBy(
						lodashFilter(
							item.list,
							(item: SportMarket) =>
								item.isResolved &&
								!item.isCanceled &&
								dayjs(Number(item.maturityDate) * 1000)
									.add(7, 'day')
									.isAfter(dayjs())
						),

						['maturityDate']
					),

					[MATCHES.PAUSED]: sortBy(
						lodashFilter(
							item.list,
							(item: SportMarket) =>
								(item.isCanceled || item.isPaused) &&
								dayjs(Number(item.maturityDate) * 1000)
									.add(7, 'day')
									.isAfter(dayjs())
						),
						['maturityDate']
					)
				}
			})
			setAllLeagues(withStatusSeparation as ILeague[])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	// Set filter from url
	useEffect(() => {
		setFilter({
			status: (router.query.status as MATCHES) || MATCHES.OPEN,
			sport: (router.query.sport as string) || STATIC.ALL,
			league: (router.query.league as string) || STATIC.ALL
		})
		if ((router.query.sport && router.query.sport !== STATIC.ALL) || (router.query.league && router.query.league !== STATIC.ALL)) {
			setFilterOpened(true)
		}
	}, [router.query.sport, router.query.league, router.query.status])

	useEffect(() => {
		if (router.isReady) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						status: filter.status
					}
				},
				undefined,
				{ shallow: true }
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter.status, router.isReady])

	useEffect(() => {
		if (includes([STATIC.ALL, undefined], filter.sport) && includes([STATIC.ALL, undefined], filter.league)) {
			setSelectedSport(TAGS_LIST)
		}
		if (!includes([STATIC.ALL, undefined], filter.sport) && includes([STATIC.ALL, undefined], filter.league)) {
			setSelectedSport(lodashFilter(TAGS_LIST, (item) => includes(SPORTS_TAGS_MAP[filter.sport as string], item.id)))
		}
		if (!includes([STATIC.ALL, undefined], filter.league)) {
			setSelectedSport([find(TAGS_LIST, (item) => toString(item.id) === filter.league) as any])
		}
	}, [filter.sport, filter.league])

	useEffect(() => {
		setResultsCount(getResultsCount(filterMatches(filter)))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSport, filter.status])

	const getFilterCount = useMemo(() => {
		let filterCount = 0
		if (!includes([STATIC.ALL, undefined], filter.sport)) {
			filterCount += 1
		}
		if (!includes([STATIC.ALL, undefined], filter.league)) {
			filterCount += 1
		}

		return { showCount: !!filterCount, filterCount }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSport])

	const onShowResults = (preventScroll = false) => {
		const results = filterMatches(filter)

		setFiltered({
			matches: results,
			sport: selectedSport.filter((item) =>
				includes(
					results.map((result) => result.id),
					item.id
				)
			)
		})
		if (isBellowOrEqualResolution(size, RESOLUTIONS.MD)) {
			setFilterOpened(false)
		}
		if (!preventScroll && contentRef.current) {
			contentRef.current?.scrollIntoView()
		}
	}

	useEffect(() => {
		setLoading(true)
		mapMatchesByLeagueByStatus()
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	useEffect(() => {
		if (allLeagues.length !== 0) {
			onShowResults(true)
			setResultsCount(getResultsCount(filtered.matches))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allLeagues])

	const changeStatusFilter = async () => {
		setFiltered((current) => ({
			...current,
			matches: []
		}))
		const results = await filterMatches({ league: STATIC.ALL, sport: STATIC.ALL, status: filter.status })
		setFiltered({
			matches: results,
			sport: TAGS_LIST.filter((item) =>
				includes(
					results.map((result) => result.id),
					item.id
				)
			)
		})
	}

	useEffect(() => {
		changeStatusFilter()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter.status])

	const memoizedList = useMemo(() => {
		return (
			<SCS.LeagueWrapper>
				{isLoading || isFailure || loading ? (
					<>
						<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
						<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
						<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					</>
				) : (
					map(filtered.sport, (item) => {
						const leagueMatches = find(filtered.matches, ['id', item.id])?.[filter.status] || []
						return (
							<>
								<SCS.LeagueHeader>
									{item?.country && item?.country !== STATIC.WORLD && (
										<SC.FlagWrapper>
											<Flag code={item.country} />
										</SC.FlagWrapper>
									)}

									{item?.country && item?.country === STATIC.WORLD && <FlagWorld />}
									{item?.label}
								</SCS.LeagueHeader>
								<MatchesList key={`leaguePannel-${item.id}-${filter.status}`} matches={leagueMatches || []} filter={filter} loading={false} />
							</>
						)
					})
				)}
				{filtered.matches.length === 0 && filter.status === MATCHES.ONGOING && (
					<SC.ErrorStateNoData>
						<h3>{t('No matches found')}</h3>
						<p>{t('There are currently no matches being played')}</p>
						<br />
						<Button
							btnStyle={'secondary'}
							onClick={() =>
								router.replace({
									pathname: 'matches',
									query: {
										status: 'open'
									}
								})
							}
							content={'Back to open matches'}
							style={{ maxWidth: '220px' }}
						/>
					</SC.ErrorStateNoData>
				)}
			</SCS.LeagueWrapper>
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtered.matches, filtered.sport, filter, isLoading, isFailure])

	return (
		<>
			{isMounted && (
				<SCS.ListHeader>
					{isBellowOrEqualResolution(size, RESOLUTIONS.MD) ? (
						<>
							<SCS.MobileSelectionHeader>
								<SCS.ContentTitle>{t('Matches')}</SCS.ContentTitle>
								<SCS.FilterBtn onClick={() => setFilterOpened(!isFilterOpened)}>
									<SCS.FilterIcon src={FilterIcon} />
									{getFilterCount.showCount && <SCS.FilterCount>{getFilterCount.filterCount}</SCS.FilterCount>}
								</SCS.FilterBtn>
							</SCS.MobileSelectionHeader>
							<div style={{ marginBottom: '16px' }}>
								<Select options={MATCHES_OPTIONS} onChange={handleChange} value={filter.status} />
							</div>
						</>
					) : (
						<>
							<RadioButtons
								defaultValue={MATCHES.OPEN}
								options={MATCHES_OPTIONS}
								onChange={(event) => {
									handleChange(event.target.value)
								}}
								value={filter.status}
							/>
							<SCS.FilterBtn
								onClick={() => {
									setFilterOpened(!isFilterOpened)
								}}
							>
								<SCS.FilterIcon src={FilterIcon} />
								{getFilterCount.showCount && <SCS.FilterCount>{getFilterCount.filterCount}</SCS.FilterCount>}
							</SCS.FilterBtn>
						</>
					)}
				</SCS.ListHeader>
			)}
			{isFilterOpened && (
				<MatchFilter
					resultsCount={resultsCount}
					onReset={() => {
						setFilter((currentFilter: any) => ({ ...currentFilter, league: STATIC.ALL, sport: STATIC.ALL }))
					}}
					onShowResults={onShowResults}
					onCloseMobileFilter={() => {
						setFilterOpened(false)
					}}
				/>
			)}
			<Row gutter={16} ref={contentRef}>
				<Col span={24}>{memoizedList}</Col>
			</Row>
		</>
	)
}

export default memo(MatchesContent)
