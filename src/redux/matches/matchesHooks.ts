import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { useNetwork } from 'wagmi'

import { GET_ALL_SPORT_MARKETS } from '@/utils/queries'
import { getMarketOddsFromContract } from '@/utils/markets'
import { MATCHES_LIST } from './matchesTypes'

export const useFetchAllMatches = () => {
	const dispatch = useDispatch()

	const { chain } = useNetwork()
	const [fetchData0] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData1] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData2] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData3] = useLazyQuery(GET_ALL_SPORT_MARKETS)

	const contractOddsAllMatches = async (values: any) => {
		try {
			const marketOddsFromContract = await getMarketOddsFromContract([
				...values[0].data.sportMarkets,
				...values[1].data.sportMarkets,
				...values[2].data.sportMarkets,
				...values[3].data.sportMarkets
			])

			dispatch({ type: MATCHES_LIST.MATCHES_LIST_LOAD_DONE, payload: { data: marketOddsFromContract } })
		} catch (err) {
			dispatch({ type: MATCHES_LIST.MATCHES_LIST_LOAD_FAIL, payload: { data: [] } })
		}
	}

	const fetchAllMatches = () => {
		// NOTE: maximum 1000 matches per query, 6000 matches in total
		dispatch({ type: MATCHES_LIST.MATCHES_LIST_LOAD_START })
		Promise.all([
			fetchData0({ variables: { skip: 0 }, context: { chainId: chain?.id } }),
			fetchData1({ variables: { skip: 1000 }, context: { chainId: chain?.id } }),
			fetchData2({ variables: { skip: 2000 }, context: { chainId: chain?.id } }),
			fetchData3({ variables: { skip: 3000 }, context: { chainId: chain?.id } })
		])
			.then((values) => contractOddsAllMatches(values))
			.catch(() => {
				dispatch({
					type: MATCHES_LIST.MATCHES_LIST_LOAD_FAIL,
					payload: { data: [] }
				})
			})
	}

	useEffect(() => {
		fetchAllMatches()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id])

	return null
}
