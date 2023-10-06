import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { Col, Spin } from 'antd'
import { useRouter } from 'next-translate-routes'
import { LoadingOutlined } from '@ant-design/icons'

// components, assets, atoms
import * as SC from './LeaderboardContentStyles'
import Sorter from '@/components/Sorter'
import Button from '@/atoms/button/Button'
import Select from '@/atoms/select/Select'
import SortIcon from '@/assets/icons/sort-icon.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'

// utils
import { GET_TIPSTERS } from '@/utils/queries'
import { ENDPOINTS, LEADERBOARD_SORTING, ORDER_DIRECTION } from '@/utils/constants'
import { decodeSorter, markedValue, setSort } from '@/utils/helpers'
import { roundPrice } from '@/utils/formatters/currency'
import { formatAccount } from '@/utils/formatters/string'
import { getWalletImage } from '@/utils/images'

// styles
import * as SCS from '@/styles/GlobalStyles'

// types
import { LeaderboardUser } from '@/typescript/types'
import { PAGES } from '@/utils/enums'

const limit = 20

const LeaderboardContent = () => {
	const { t } = useTranslation()
	const [fetchTipsters, { loading }] = useLazyQuery<{ users: LeaderboardUser[] }>(GET_TIPSTERS)
	const [tipstersData, setTipstersData] = useState<LeaderboardUser[]>([])
	const router = useRouter()
	const { direction, property } = decodeSorter()

	const sortOptions = [
		{
			label: t('The highest profit'),
			value: `${LEADERBOARD_SORTING.PROFITS}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The lowest profit'),
			value: `${LEADERBOARD_SORTING.PROFITS}:${ORDER_DIRECTION.ASCENDENT}`
		},
		{
			label: t('The most trades'),
			value: `${LEADERBOARD_SORTING.TICKETS}:${ORDER_DIRECTION.DESCENDENT}`
		},
		{
			label: t('The least trades'),
			value: `${LEADERBOARD_SORTING.TICKETS}:${ORDER_DIRECTION.ASCENDENT}`
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
	// TODO: remove this if successRate will be added to graphQL
	const fetchSuccessRateData = async () => {
		try {
			const response = await fetch(ENDPOINTS.GET_SUCCESS_RATE())
			// TODO: Need to add computing success rate to graphQL (asked Thales for this request)
			// const successRate: ISuccessRateData = await response.json()
			// const successRateMap = new Map(successRate.stats.map((obj) => [obj.ac, obj.sr]))
			// setSuccessRateMap(successRateMap)
			return await response.json()
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			throw error
		}
	}
	const fetchData = async () => {
		router?.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					first: limit,
					skip: 0,
					orderBy: property || LEADERBOARD_SORTING.PROFITS,
					orderDirection: direction || ORDER_DIRECTION.DESCENDENT
				}
			},
			undefined,
			{ shallow: true }
		)
		try {
			const { data } = await fetchTipsters({
				variables: {
					first: limit,
					skip: 0,
					orderBy: property || LEADERBOARD_SORTING.PROFITS,
					orderDirection: direction || ORDER_DIRECTION.DESCENDENT
				}
			})

			const formattedData = (data?.users || []).map((user) => {
				// TODO: Need to add computing success rate to graphQL (asked Thales for this request)
				// const successRate = successRateMap2.get(user.id)
				const successRate = 'N/A'
				return {
					...user,
					successRate
				}
			})
			setTipstersData(formattedData)
		} catch (e) {
			setTipstersData([])
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	const loadMore = async () => {
		const currentSkip = Number(router.query.skip) || 0
		const newSkip = currentSkip + limit // Add 20 to skip for each page
		router?.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					skip: newSkip
				}
			},
			undefined,
			{ shallow: true }
		)
		try {
			const { data } = await fetchTipsters({
				variables: {
					first: limit,
					skip: newSkip,
					orderBy: property || LEADERBOARD_SORTING.PROFITS,
					orderDirection: direction || ORDER_DIRECTION.DESCENDENT
				}
			})
			const formattedNewData = (data?.users || []).map((user: LeaderboardUser) => {
				// const successRate = successRateMap.get(user.id)
				return {
					...user,
					successRate: 'N/A'
				}
			})
			setTipstersData((prevData) => [...prevData, ...formattedNewData])
		} catch (e) {
			setTipstersData([])
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	// TODO: remove this if successRate will be added to graphQL
	// useEffect(() => {
	// 	fetchSuccessRateData()
	// }, [])

	useEffect(() => {
		fetchData()
	}, [direction, property])

	return (
		<SC.LeaderboardContentWrapper>
			<h1>Leaderboard</h1>
			<SCS.SorterRow align={'middle'}>
				<Col push={6} span={6}>
					<Sorter disabled={true} title={t('Success rate')} name={LEADERBOARD_SORTING.SUCCESS_RATE} />
				</Col>
				<Col push={5} span={5}>
					<Sorter title={t('Profits')} name={LEADERBOARD_SORTING.PROFITS} />
				</Col>
				<Col push={5} span={3}>
					<Sorter title={t('Tickets')} name={LEADERBOARD_SORTING.TICKETS} />
				</Col>
			</SCS.SorterRow>
			<SCS.SelectSorters>
				<Select
					title={
						<SCS.SelectTitle>
							<img src={SortIcon} alt={'Sorter'} />
							{t('Sort by')}
						</SCS.SelectTitle>
					}
					allowClear
					options={sortOptions}
					placeholder={t('Sort by')}
					onChange={handleSubmitSort}
				/>
			</SCS.SelectSorters>
			{loading && tipstersData.length === 0 ? (
				<>
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
				</>
			) : (
				<Spin indicator={<LoadingOutlined spin />} spinning={loading}>
					{tipstersData.map((item) => {
						return (
							<SC.LeaderboardContentRow align={'middle'} gutter={[0, 16]}>
								<Col span={12} md={6}>
									<SC.Wallet>
										<SC.WalletIcon imageSrc={getWalletImage(item.id)} />
										<SC.Title>
											<SC.Value>{formatAccount(item.id)}</SC.Value>
											<SC.Description>{t('Wallet')}</SC.Description>
										</SC.Title>
									</SC.Wallet>
								</Col>
								<Col span={12} md={5}>
									<SC.Title>
										<SC.Value>{item.successRate}</SC.Value>
										<SC.Description>{t('Success rate')}</SC.Description>
									</SC.Title>
								</Col>
								<Col span={24} md={0}>
									<SC.LeaderboardDivider />
								</Col>
								<Col span={12} md={5}>
									<SC.Title>
										<SC.Value>{`${markedValue(roundPrice(Number(item.pnl)) as string)} $`}</SC.Value>
										<SC.Description>{t('Profits')}</SC.Description>
									</SC.Title>
								</Col>
								<Col span={12} md={3}>
									<SC.Title>
										<SC.Value>{item.trades}</SC.Value>
										<SC.Description>{item.trades === 1 ? t('Ticket') : t('Tickets')}</SC.Description>
									</SC.Title>
								</Col>
								<Col span={24} md={5}>
									<Button
										type={'primary'}
										size={'large'}
										btnStyle={'secondary'}
										onClick={() => {
											// TODO: in detail of tipster
											router.push(`/${PAGES.LEADERBOARD}/${item.id}`)
										}}
										content={<span>{t('Show more')}</span>}
									/>
								</Col>
							</SC.LeaderboardContentRow>
						)
					})}
				</Spin>
			)}
			<Button
				type={'primary'}
				size={'large'}
				disabled={loading}
				btnStyle={'secondary'}
				onClick={() => {
					loadMore()
				}}
				content={
					<SC.ButtonContent>
						<span>{t('Show more')}</span>
						<SC.ButtonIcon src={ArrowDownIcon} />
					</SC.ButtonContent>
				}
			/>
		</SC.LeaderboardContentWrapper>
	)
}

export default LeaderboardContent
