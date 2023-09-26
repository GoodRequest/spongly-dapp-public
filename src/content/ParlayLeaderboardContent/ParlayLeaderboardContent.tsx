import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { orderBy, round } from 'lodash'
import { useRouter } from 'next-translate-routes'

import BackButton from '@/atoms/backButton/BackButton'
import Select from '@/atoms/select/Select'
import Search from '@/atoms/search/Search'
import ParlayLeaderboardTableRow from '@/components/parlayLeaderboardTableRow/ParlayLeaderboardTableRow'
import ParlayLeaderboardUserRow from '@/components/parlayLeaderboardTableRow/ParlayLeaderboardUserRow'
import Button from '@/atoms/button/Button'
import { ENDPOINTS, ErrorNotificationTypes, NETWORK_IDS, OddsType, ORDER_DIRECTION, PARLAY_LEADERBOARD_SORTING } from '@/utils/constants'
import { getReq } from '@/utils/requests'
import { getCurrentBiweeklyPeriod, getPeriodEndsText, getReward, handleErrorMessage } from '@/utils/helpers'
import { useIsMounted } from '@/hooks/useIsMounted'
import { Option, ParlayLeaderboardTableItem } from '@/typescript/types'

import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'
import WarningIcon from '@/assets/icons/warning-icon.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import SortIcon from '@/assets/icons/sort-icon.svg'

import * as SC from './ParlayLeaderboardContentStyles'
import { formatQuote } from '@/utils/formatters/quote'

type ParlayLeaderboardFilter = {
	page: number
	period: string
	search: string
	orderDirection: ORDER_DIRECTION
	orderBy: PARLAY_LEADERBOARD_SORTING
}

const ParlayLeaderboardContent = () => {
	const { t } = useTranslation()
	const isMounted = useIsMounted()
	const router = useRouter()
	const { chain } = useNetwork()
	const { address } = useAccount()

	const { query, isReady } = useRouter()

	// duplicite init, o avoid handling undefined state
	const [filters, setFilters] = useState<ParlayLeaderboardFilter>({
		page: 1,
		period: `${getCurrentBiweeklyPeriod()}`,
		search: '',
		orderDirection: ORDER_DIRECTION.ASCENDENT,
		orderBy: PARLAY_LEADERBOARD_SORTING.RANK
	})

	useEffect(() => {
		if (isReady) {
			setFilters({
				page: Number(query?.page) ? Number(query?.page) : 1,
				period: query?.period ? (query?.period as string) : `${getCurrentBiweeklyPeriod()}`,
				search: query?.search ? (query?.search as string) : '',
				orderDirection: query?.orderDirection ? (query?.orderDirection as ORDER_DIRECTION) : ORDER_DIRECTION.ASCENDENT,
				orderBy: query?.orderBy ? (query?.orderBy as PARLAY_LEADERBOARD_SORTING) : PARLAY_LEADERBOARD_SORTING.RANK
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady])

	useEffect(() => {
		router.replace(
			{
				pathname: '/parlay-leaderboard',
				query: {
					page: filters?.page,
					period: filters?.period,
					search: filters?.search,
					orderDirection: filters?.orderDirection,
					orderBy: filters?.orderBy
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
			setParlayLeaderboardData(sortData(newParlayData, filters.orderBy as PARLAY_LEADERBOARD_SORTING, filters?.orderDirection as ORDER_DIRECTION))
		} catch (e) {
			handleErrorMessage(ErrorNotificationTypes.TABLE, t)
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
		setParlayLeaderboardData(sortData(parlayLeaderboardData, filters?.orderBy as PARLAY_LEADERBOARD_SORTING, filters?.orderDirection as ORDER_DIRECTION))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters?.orderBy, filters?.orderDirection])

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

	const getIcon = (orderedBy: PARLAY_LEADERBOARD_SORTING) => {
		if (filters?.orderBy === orderedBy) {
			if (filters?.orderDirection === ORDER_DIRECTION.ASCENDENT) {
				return <SC.ButtonIcon src={ArrowDownIcon} style={{ transform: 'rotate(180deg)' }} />
			}
			return <SC.ButtonIcon src={ArrowDownIcon} />
		}
		return <SC.ButtonIcon src={SortIcon} />
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
				<SC.Empty
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
					quote={data.quote ? formatQuote(OddsType.DECIMAL, data?.quote) : 0}
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

	const handleOrderButtonClick = (orderBy: PARLAY_LEADERBOARD_SORTING) => {
		if (orderBy === filters?.orderBy) {
			if (filters?.orderDirection === ORDER_DIRECTION.DESCENDENT) {
				setFilters({
					...filters,
					orderDirection: ORDER_DIRECTION.ASCENDENT
				})
			} else {
				setFilters({
					...filters,
					orderDirection: ORDER_DIRECTION.DESCENDENT
				})
			}
		} else {
			setFilters({
				...filters,
				orderDirection: ORDER_DIRECTION.ASCENDENT,
				orderBy
			})
		}
	}

	return (
		<>
			<SC.PCRow>
				<Col span={24}>
					<BackButton backUrl={'/dashboard'} />
				</Col>
			</SC.PCRow>
			<SC.ContentWrapper>
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
				<SC.FilterRow style={{ marginTop: '32px' }}>
					<Col span={24}>
						<Row align={'middle'}>
							<Col span={6}>
								<SC.OrderButton
									className={`${filters?.orderBy === PARLAY_LEADERBOARD_SORTING.RANK ? 'active' : ''}`}
									onClick={() => handleOrderButtonClick(PARLAY_LEADERBOARD_SORTING.RANK)}
								>
									<SC.ButtonContent>
										{t('Rank')}
										{getIcon(PARLAY_LEADERBOARD_SORTING.RANK)}
									</SC.ButtonContent>
								</SC.OrderButton>
							</Col>

							<SC.CenterRowContent span={3}>
								<SC.OrderButton
									className={`${filters?.orderBy === PARLAY_LEADERBOARD_SORTING.POSITION ? 'active' : ''}`}
									onClick={() => handleOrderButtonClick(PARLAY_LEADERBOARD_SORTING.POSITION)}
								>
									<SC.ButtonContent>
										{t('Positions')}
										{getIcon(PARLAY_LEADERBOARD_SORTING.POSITION)}
									</SC.ButtonContent>
								</SC.OrderButton>
							</SC.CenterRowContent>

							<SC.CenterRowContent span={4}>
								<SC.OrderButton
									className={`${filters?.orderBy === PARLAY_LEADERBOARD_SORTING.PAID ? 'active' : ''}`}
									onClick={() => handleOrderButtonClick(PARLAY_LEADERBOARD_SORTING.PAID)}
								>
									<SC.ButtonContent>
										<span>{t('Buy-in')}</span>
										{getIcon(PARLAY_LEADERBOARD_SORTING.PAID)}
									</SC.ButtonContent>
								</SC.OrderButton>
							</SC.CenterRowContent>

							<SC.CenterRowContent span={3}>
								<SC.OrderButton
									className={`${filters?.orderBy === PARLAY_LEADERBOARD_SORTING.QUOTE ? 'active' : ''}`}
									onClick={() => handleOrderButtonClick(PARLAY_LEADERBOARD_SORTING.QUOTE)}
								>
									<SC.ButtonContent>
										<span>{t('Quote')}</span>
										{getIcon(PARLAY_LEADERBOARD_SORTING.QUOTE)}
									</SC.ButtonContent>
								</SC.OrderButton>
							</SC.CenterRowContent>

							<SC.CenterRowContent span={4}>
								<SC.OrderButton
									className={`${filters?.orderBy === PARLAY_LEADERBOARD_SORTING.WON ? 'active' : ''}`}
									onClick={() => handleOrderButtonClick(PARLAY_LEADERBOARD_SORTING.WON)}
								>
									<SC.ButtonContent>
										<span>{t('Won')}</span>
										{getIcon(PARLAY_LEADERBOARD_SORTING.WON)}
									</SC.ButtonContent>
								</SC.OrderButton>
							</SC.CenterRowContent>

							<SC.CenterRowContent span={4}>
								<SC.OrderButton className={'no-sorting'} disabled>
									<SC.ButtonContent>
										<span>{t('Reward')}</span>
									</SC.ButtonContent>
								</SC.OrderButton>
							</SC.CenterRowContent>
						</Row>
					</Col>
				</SC.FilterRow>
				<Row>
					<Col span={24}>{parlayLeaderBoard()}</Col>
				</Row>
				{hasMoreData() && (
					<Row>
						<Col span={24}>
							<Button
								type={'primary'}
								btnStyle={'secondary'}
								onClick={showMore}
								style={{ marginTop: '32px', height: '60px' }}
								content={
									<SC.ButtonContent>
										<span>{t('Show more')}</span>
										<SC.ButtonIcon src={ArrowDownIcon} />
									</SC.ButtonContent>
								}
							/>
						</Col>
					</Row>
				)}
			</SC.ContentWrapper>
		</>
	)
}

export default ParlayLeaderboardContent
