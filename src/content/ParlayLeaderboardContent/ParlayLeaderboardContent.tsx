import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { orderBy, round } from 'lodash'
import { useRouter } from 'next-translate-routes'

import Select from '@/atoms/select/Select'
import Search from '@/atoms/search/Search'
import ParlayLeaderboardTableRow from '@/components/parlayLeaderboardTableRow/ParlayLeaderboardTableRow'
import ParlayLeaderboardUserRow from '@/components/parlayLeaderboardTableRow/ParlayLeaderboardUserRow'
import { ENDPOINTS, NETWORK_IDS, OddsType, ORDER_DIRECTION, PARLAY_LEADERBOARD_SORTING } from '@/utils/constants'
import { getReq } from '@/utils/requests'
import { decodeSorter, getCurrentBiweeklyPeriod, getPeriodEndsText, getReward, isWindowReady, setSort } from '@/utils/helpers'
import { useIsMounted } from '@/hooks/useIsMounted'
import { Option, ParlayLeaderboardTableItem } from '@/typescript/types'

import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import WarningIcon from '@/assets/icons/warning-icon.svg'

import * as SC from './ParlayLeaderboardContentStyles'
import * as SCS from '@/styles/GlobalStyles'
import { formatQuote } from '@/utils/formatters/quote'
import { PAGES } from '@/utils/enums'
import Sorter from '@/components/Sorter'
import ArrowIcon from '@/assets/icons/arrow-down.svg'

type ParlayLeaderboardFilter = {
	page: number
	period: string
	search: string
	sorter: string
}

const ParlayLeaderboardContent = () => {
	const { t } = useTranslation()
	const isMounted = useIsMounted()
	const router = useRouter()
	const { chain } = useNetwork()
	const { address } = useAccount()

	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

	const { query, isReady } = useRouter()

	const sortOptions = [
		{
			label: t('The highest rank'),
			value: `${PARLAY_LEADERBOARD_SORTING.RANK}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest rank'),
			value: `${PARLAY_LEADERBOARD_SORTING.RANK}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The most matches'),
			value: `${PARLAY_LEADERBOARD_SORTING.POSITION}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The least matches'),
			value: `${PARLAY_LEADERBOARD_SORTING.POSITION}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The highest buy-in'),
			value: `${PARLAY_LEADERBOARD_SORTING.PAID}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest buy-in'),
			value: `${PARLAY_LEADERBOARD_SORTING.PAID}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The highest quote'),
			value: `${PARLAY_LEADERBOARD_SORTING.QUOTE}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest quote'),
			value: `${PARLAY_LEADERBOARD_SORTING.QUOTE}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The highest win'),
			value: `${PARLAY_LEADERBOARD_SORTING.WON}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest win'),
			value: `${PARLAY_LEADERBOARD_SORTING.WON}:${ORDER_DIRECTION.ASCENDENT}`
		}
	]

	const handleSubmitSort = (value: string) => {
		if (!value) {
			// clear sort
			setSort(undefined)
		} else {
			const [property, direction] = value.split(':')
			setSort(property, direction as ORDER_DIRECTION)
		}
	}

	// duplicite init, o avoid handling undefined state
	const [filters, setFilters] = useState<ParlayLeaderboardFilter>({
		page: 1,
		period: `${getCurrentBiweeklyPeriod()}`,
		search: '',
		sorter: ''
	})

	useEffect(() => {
		if (isReady) {
			setFilters({
				page: Number(query?.page) ? Number(query?.page) : 1,
				period: query?.period ? (query?.period as string) : `${getCurrentBiweeklyPeriod()}`,
				search: query?.search ? (query?.search as string) : '',
				sorter: query?.sorter ? (query?.sorter as string) : ''
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady])

	useEffect(() => {
		router.replace(
			{
				pathname: `/${PAGES.PARLAY_SUPERSTARS}`,
				query: {
					page: filters?.page,
					period: filters?.period,
					search: filters?.search,
					sorter: filters?.sorter
				}
			},
			undefined,
			{ scroll: false }
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters])

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [parlayLeaderboardData, setParlayLeaderboardData] = useState<ParlayLeaderboardTableItem[] | undefined>(undefined)
	const [userRank, setUserRank] = useState<ParlayLeaderboardTableItem | undefined>(undefined)

	const sortData = (data: ParlayLeaderboardTableItem[] | undefined, sortedBy: PARLAY_LEADERBOARD_SORTING, orderDirection: ORDER_DIRECTION) => {
		return orderBy(data, [sortedBy], [orderDirection])
	}

	const loadLeaderboard = async () => {
		try {
			setIsLoading(true)
			const { data } = await getReq(t, ENDPOINTS.GET_PARLAY_LEADERBOARD(chain?.id || NETWORK_IDS.OPTIMISM, Number(filters.period)))
			const newParlayData: ParlayLeaderboardTableItem[] = data?.map((item: any) => {
				const newItem: ParlayLeaderboardTableItem = {
					rank: item?.rank,
					address: item?.account,
					position: item?.numberOfPositions,
					quote: item?.totalQuote ? item?.totalQuote : 0,
					paid: item?.sUSDPaid ? item?.sUSDPaid : 0,
					won: item?.totalAmount ? item?.totalAmount : 0
				}
				return newItem
			})

			if (address) {
				const userRank: ParlayLeaderboardTableItem | undefined = newParlayData?.find((item) => item?.address === address)
				if (userRank) {
					setUserRank(userRank)
				}
			}
			const { direction, property } = decodeSorter()
			setParlayLeaderboardData(sortData(newParlayData, property as PARLAY_LEADERBOARD_SORTING, direction as ORDER_DIRECTION))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
			setParlayLeaderboardData([])
		} finally {
			setIsLoading(false)
		}
	}

	const biweeklyPeriodOptions = (): Option[] => {
		const newOptions: Option[] = []

		for (let i = 0; i <= getCurrentBiweeklyPeriod(); i += 1) {
			const newOption = {
				label: `${t('Bi-weekly period')} ${i + 1}`,
				value: `${i}`
			}
			newOptions.push(newOption)
		}

		return newOptions
	}

	const onPeriodChange = (value: string) => {
		setFilters({
			...filters,
			period: value,
			page: 1
		})
	}

	const onSearchChange = (value: any) => {
		setFilters({
			...filters,
			search: value || ''
		})
	}

	useEffect(() => {
		const { direction, property } = decodeSorter()
		setParlayLeaderboardData(sortData(parlayLeaderboardData, property as PARLAY_LEADERBOARD_SORTING, direction as ORDER_DIRECTION))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.sorter])

	useEffect(() => {
		loadLeaderboard()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id, filters?.period])

	const showMore = () => {
		setFilters({
			...filters,
			page: filters.page + 1
		})
	}

	const parlayLeaderBoard = () => {
		if (isLoading) {
			return (
				<>
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
				</>
			)
		}

		let shownData = parlayLeaderboardData
		if (filters?.search) {
			shownData = shownData?.filter((item) => item?.address?.includes(filters.search || ''))
		}
		if (shownData?.length === 0) {
			return (
				<SCS.Empty
					image={EmptyStateImage}
					description={
						<div>
							<p>{t('Leaderboard is empty')}</p>
							<span>{t('Leaderboard is empty for chosen bi-weekly period')}</span>
						</div>
					}
				/>
			)
		}

		return shownData
			?.slice(0, Number(filters?.page) * 15)
			.map((data, index) => (
				<ParlayLeaderboardTableRow
					key={index}
					rank={data.rank}
					address={data.address}
					position={data.position}
					paid={data.paid ? round(Number(data?.paid), 2).toFixed(2) : 0}
					quote={data.quote ? formatQuote(actualOddType, data?.quote) : 0}
					won={data.won ? round(Number(data?.won), 2).toFixed(2) : 0}
					reward={getReward(data?.rank ? data.rank - 1 : undefined, chain?.id)}
				/>
			))
	}

	const hasMoreData = () => {
		let shownData = parlayLeaderboardData
		if (filters?.search) {
			shownData = shownData?.filter((item) => item?.address?.includes(filters.search || ''))
		}

		if ((shownData?.length || 0) > Number(filters?.page) * 15) {
			return true
		}

		return false
	}

	return (
		<>
			<Row>
				<SC.ParlayLeaderboardTextCol span={24}>
					<SC.ParlayLeaderboardTitle>{t('Parlay incentives superstars')}</SC.ParlayLeaderboardTitle>
					<SC.ParlayLeaderboardContext>
						{t(
							'A total of 1,000 OP will be distributed to the best parlays with minimum 3 games on a bi-weekly basis. The tickets will be ranked based on a total quote, followed by the number of positions on the parlays.'
						)}
					</SC.ParlayLeaderboardContext>
					<SC.ParlayLeaderboardContext>{t('Rewards will be distributed to the TOP 10 parlays every 2 weeks!')}</SC.ParlayLeaderboardContext>
					<SC.ParlayLeaderboardContext style={{ marginBottom: '16px' }}>
						{t(
							'If multiple parlays have the same total quote and the number of positions the following will be used as tie-breakers in respective order'
						)}
						:
					</SC.ParlayLeaderboardContext>
					<SC.ParlayLeaderboardList>
						<li>{t('The amount paid')}</li>
						<li>{t('Actual total quote (gotten by multiplying positions individually)')}</li>
					</SC.ParlayLeaderboardList>
					<SC.ParlayleaderboardText>{t('* 1 winning parlay eligible per wallet')}</SC.ParlayleaderboardText>
				</SC.ParlayLeaderboardTextCol>
			</Row>
			<Row style={{ marginTop: '-16px' }}>
				<Col span={24}>
					<SC.ParlayLeaderboardFilterRow justify={'space-between'} gutter={32}>
						<Col md={12} xs={24}>
							<SC.FilterWrapper>
								<Select options={biweeklyPeriodOptions()} onChange={onPeriodChange} value={filters.period} />
								<SC.PeriodDiv>
									<SC.WarningIcon src={WarningIcon} />
									{isMounted && <SC.PeriodSubtext>{getPeriodEndsText(Number(filters?.period), t)}</SC.PeriodSubtext>}
								</SC.PeriodDiv>
							</SC.FilterWrapper>
						</Col>
						<Col md={12} xs={24}>
							<SC.FilterWrapper className={'search'}>
								<Search value={filters?.search} onChange={onSearchChange} placeholder={`${t('Search wallet address')}`} />
							</SC.FilterWrapper>
						</Col>
					</SC.ParlayLeaderboardFilterRow>
				</Col>
			</Row>
			{userRank && (
				<Row style={{ marginTop: '32px' }}>
					<Col span={24}>
						<SC.YourPositionText>{t('Your current position')}</SC.YourPositionText>
						<ParlayLeaderboardUserRow
							rank={userRank?.rank}
							address={userRank?.address}
							position={userRank?.position}
							paid={userRank?.paid}
							quote={userRank?.quote}
							won={userRank?.won}
							reward={getReward(userRank.rank - 1, chain?.id)}
						/>
					</Col>
				</Row>
			)}
			<SC.ParlayLeaderboardTableText>{t('Leader board')}</SC.ParlayLeaderboardTableText>
			{/* // Sorters */}
			<SCS.SorterRow>
				<SCS.HorizontalSorters $horizontalSpacing={16}>
					<Col span={3}>
						<Sorter title={t('Rank')} name={PARLAY_LEADERBOARD_SORTING.RANK} />
					</Col>
					<Col span={3}>
						<Sorter title={t('Wallet')} />
					</Col>
					<Col span={4}>
						<Sorter title={t('Positions')} name={PARLAY_LEADERBOARD_SORTING.POSITION} />
					</Col>
					<Col span={4}>
						<Sorter title={t('Buy-in')} name={PARLAY_LEADERBOARD_SORTING.PAID} />
					</Col>
					<Col span={3}>
						<Sorter title={t('Quote')} name={PARLAY_LEADERBOARD_SORTING.QUOTE} />
					</Col>
					<Col span={4}>
						<Sorter title={t('Won')} name={PARLAY_LEADERBOARD_SORTING.WON} />
					</Col>
					<Col span={3}>
						<Sorter title={t('Reward')} />
					</Col>
				</SCS.HorizontalSorters>
				<SCS.SelectSorters>
					<Select options={sortOptions} placeholder={t('Sort by')} onChange={handleSubmitSort} />
				</SCS.SelectSorters>
			</SCS.SorterRow>
			<Row>
				<Col span={24}>{parlayLeaderBoard()}</Col>
			</Row>
			{hasMoreData() && (
				<SCS.LoadMore onClick={showMore}>
					{t('Show more')}
					<SCS.Icon icon={ArrowIcon} />
				</SCS.LoadMore>
			)}
		</>
	)
}

export default ParlayLeaderboardContent
