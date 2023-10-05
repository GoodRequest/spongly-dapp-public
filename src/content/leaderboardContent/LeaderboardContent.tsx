import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useLazyQuery } from '@apollo/client'
import { Col } from 'antd'
import { useRouter } from 'next-translate-routes'
import * as SC from './LeaderboardContentStyles'
import { GET_TIPSTERS } from '@/utils/queries'
import * as SCS from '@/styles/GlobalStyles'
import Sorter from '@/components/Sorter'
import { LEADERBOARD_SORTING, ORDER_DIRECTION } from '@/utils/constants'
import { decodeSorter } from '@/utils/helpers'
import { roundPrice } from '@/utils/formatters/currency'

type Props = {}

const limit = 20

const LeaderboardContent = (props: Props) => {
	const { t } = useTranslation()
	const [fetchTipsters, { fetchMore }] = useLazyQuery(GET_TIPSTERS)
	const [tipstersData, setTipstersData] = useState<any>([])
	const router = useRouter()

	const { direction, property } = decodeSorter()
	const fetchData = async () => {
		try {
			const { data } = await fetchTipsters({
				variables: {
					first: limit,
					skip: 0,
					orderBy: property || LEADERBOARD_SORTING.PROFITS,
					orderDirection: direction || ORDER_DIRECTION.DESCENDENT
				}
			})
			setTipstersData(data.users)
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
				setTipstersData((prevData: any) => [...prevData, ...fetchMoreResult.users])
			}
		})
	}
	useEffect(() => {
		fetchData()
	}, [direction, property])

	return (
		<SC.LeaderboardContentWrapper>
			<h1>Leaderboard</h1>
			<SCS.SorterRow align={'middle'}>
				<SCS.HorizontalSorters>
					<Col span={6}>
						<Sorter disabled={true} title={t('Success rate')} name={LEADERBOARD_SORTING.SUCCESS_RATE} />
					</Col>
					<Col span={3}>
						<Sorter title={t('Profits')} name={LEADERBOARD_SORTING.PROFITS} />
					</Col>
					<Col span={4}>
						<Sorter title={t('Tickets')} name={LEADERBOARD_SORTING.TICKETS} />
					</Col>
				</SCS.HorizontalSorters>
			</SCS.SorterRow>
			<ul>
				{tipstersData.map((item: any) => {
					return (
						<li>
							{item.id} | {item.trades} | {roundPrice(item.pnl)} | {item.pnl}
						</li>
					)
				})}
			</ul>
			<button
				onClick={() => {
					loadMore()
					// const currentSkip = Number(router.query.skip) || 0
					// // const newPage = Number(router.query.page) + 1 || 1
					// const newSkip = currentSkip + 20 // Add 20 to skip for each page
					// router?.push(
					// 	{
					// 		pathname: router.pathname,
					// 		query: {
					// 			...router.query,
					// 			skip: newSkip
					// 			// page: newPage.toString()
					// 		}
					// 	},
					// 	undefined,
					// 	{ shallow: true }
					// )
				}}
			>
				Load 20 mext
			</button>
		</SC.LeaderboardContentWrapper>
	)
}

export default LeaderboardContent
