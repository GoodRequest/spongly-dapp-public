import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { Col } from 'antd'
import { useRouter } from 'next-translate-routes'

import * as SC from './LeaderboardContentStyles'
import { GET_TIPSTERS } from '@/utils/queries'
import * as SCS from '@/styles/GlobalStyles'
import Sorter from '@/components/Sorter'
import { ENDPOINTS, LEADERBOARD_SORTING, ORDER_DIRECTION, TICKET_SORTING } from '@/utils/constants'
import { decodeSorter, markedValue, setSort } from '@/utils/helpers'
import { roundPrice } from '@/utils/formatters/currency'
import Button from '@/atoms/button/Button'
import { formatAccount } from '@/utils/formatters/string'
import { getWalletImage } from '@/utils/images'
import Select from '@/atoms/select/Select'
import SortIcon from '@/assets/icons/sort-icon.svg'

const limit = 20

const LeaderboardContent = () => {
	const { t } = useTranslation()
	const [fetchTipsters, { fetchMore, loading }] = useLazyQuery(GET_TIPSTERS)
	const [tipstersData, setTipstersData] = useState<any>([])
	const router = useRouter()
	const { direction, property } = decodeSorter()
	// const [successRateMap, setSuccessRateMap] = useState<any>()
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
	const fetchSuccessRateData = async () => {
		try {
			const response = await fetch(ENDPOINTS.GET_SUCCESS_RATE())
			// const successRate: ISuccessRateData = await response.json()
			// const successRateMap = new Map(successRate.stats.map((obj) => [obj.ac, obj.sr]))
			// console.log('response vo funkcii', successRate)
			// setSuccessRateMap(successRateMap)
			// const successRateMap = new Map(successRate.stats.map((obj) => [obj.ac, obj.sr]))
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
			// const successRate2 = await fetchSuccessRateData()
			// console.log('successRate', successRate2)
			// const found = successRate2.stats.find((item: any) => item.ac === '0xff936b80783b32ad3f2b4e610d04c9778c4669a0')
			// console.log('found', found)
			// const successRateMap2 = new Map(successRate2.stats.map((obj: any) => [obj.ac, obj.sr]))
			// console.log('successRateMap', successRateMap)
			const { data } = await fetchTipsters({
				variables: {
					first: limit,
					skip: 0,
					orderBy: property || LEADERBOARD_SORTING.PROFITS,
					orderDirection: direction || ORDER_DIRECTION.DESCENDENT
				}
			})
			const formattedData = data.users.map((user: any) => {
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
	const loadMore = () => {
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
		fetchMore({
			variables: {
				first: limit,
				skip: newSkip,
				orderBy: property || LEADERBOARD_SORTING.PROFITS,
				orderDirection: direction || ORDER_DIRECTION.DESCENDENT
			},
			updateQuery: (_, { fetchMoreResult }) => {
				const formattedNewData = fetchMoreResult.users.map((user: any) => {
					// const successRate = successRateMap.get(user.id)
					return {
						...user,
						successRate: 'N/A'
					}
				})
				setTipstersData((prevData: any) => [...prevData, ...formattedNewData])
			}
		})
	}

	useEffect(() => {
		fetchSuccessRateData()
	}, [])

	useEffect(() => {
		fetchData()
	}, [direction, property])

	return (
		<SC.LeaderboardContentWrapper>
			<h1>Leaderboard</h1>
			<SCS.SorterRow gutter={[24, 0]} align={'middle'}>
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
			<SC.SelectSorters>
				<Select
					title={
						<SC.SelectTitle>
							<img src={SortIcon} alt={'Sorter'} />
							{t('Sort by')}
						</SC.SelectTitle>
					}
					allowClear
					options={sortOptions}
					placeholder={t('Sort by')}
					onChange={handleSubmitSort}
				/>
			</SC.SelectSorters>
			{loading ? (
				<>
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
					<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
				</>
			) : (
				tipstersData.map((item: any) => {
					return (
						<SC.LeaderboardContenRow align={'middle'} gutter={[24, 0]}>
							<Col span={6}>
								<SC.Wallet>
									<SC.WalletIcon imageSrc={getWalletImage(item.id)} />
									<SC.Title>
										{formatAccount(item.id)}
										<SC.Description>{t('Wallet')}</SC.Description>
									</SC.Title>
								</SC.Wallet>
							</Col>
							<Col span={5}>
								<SC.Title>
									{item.successRate}
									<SC.Description>{t('Success rate')}</SC.Description>
								</SC.Title>
							</Col>
							<Col span={5}>
								<SC.Title>
									{`${markedValue(roundPrice(item.pnl) as string)} $`}
									<SC.Description>{t('Profits')}</SC.Description>
								</SC.Title>
							</Col>
							<Col span={3}>
								<SC.Title>
									{item.trades}
									<SC.Description>{item.trades === 1 ? t('Ticket') : t('Tickets')}</SC.Description>
								</SC.Title>
							</Col>
							<Col span={5}>
								<Button
									type={'primary'}
									size={'large'}
									btnStyle={'secondary'}
									onClick={() => {
										// TODO: in detail of tipster
										// router.push(`/tipster/${item.id}`)
									}}
									content={<span>{t('Show more')}</span>}
								/>
							</Col>
						</SC.LeaderboardContenRow>
					)
				})
			)}
			<Button
				type={'primary'}
				size={'large'}
				disabled={loading}
				btnStyle={'secondary'}
				onClick={() => {
					loadMore()
				}}
				content={<span>{t('Show more')}</span>}
			/>
		</SC.LeaderboardContentWrapper>
	)
}

export default LeaderboardContent
