import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { useNetwork } from 'wagmi'

import { SET_ALL_MATCHES } from './matchesTypes'
import { GET_ALL_SPORT_MARKETS } from '@/utils/queries'
import { getMarketOddsFromContract } from '@/utils/markets'
import { RootState } from '../rootReducer'

export const useFetchAllMatches = () => {
	const dispatch = useDispatch()
	const rawMatches = useSelector((state: RootState) => state.matches.rawMatches)
	const [fetchMeta, setFetchMeta] = useState({
		fallbackTry: 0 // NOTE: try to fetch data from contract 3 times if isFailed
	})

	const { chain } = useNetwork()
	const [fetchData0] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData1] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData2] = useLazyQuery(GET_ALL_SPORT_MARKETS)
	const [fetchData3] = useLazyQuery(GET_ALL_SPORT_MARKETS)

	const contractOddsAllMatches = async (values: any) => {
		try {
			dispatch({ type: SET_ALL_MATCHES.SET_ALL_MATCHES_ARRAY_START })
			const marketOddsFromContract = await getMarketOddsFromContract([
				...values[0].data.sportMarkets,
				...values[1].data.sportMarkets,
				...values[2].data.sportMarkets,
				...values[3].data.sportMarkets
			])

			dispatch({
				type: SET_ALL_MATCHES.SET_ALL_MATCHES_ARRAY,
				payload: {
					matches: marketOddsFromContract,
					isLoading: false,
					isFailed: false
				}
			})
		} catch (err) {
			dispatch({
				type: SET_ALL_MATCHES.SET_ALL_MATCHES_ARRAY,
				payload: {
					matches: [],
					isLoading: false,
					isFailed: true
				}
			})
		}
	}

	const fetchAllMatches = () => {
		// NOTE: maximum 1000 matches per query, 6000 matches in total
		dispatch({ type: SET_ALL_MATCHES.STATE, payload: { isLoading: true, isFailed: false } })
		Promise.all([
			fetchData0({ variables: { skip: 0 }, context: { chainId: chain?.id } }),
			fetchData1({ variables: { skip: 1000 }, context: { chainId: chain?.id } }),
			fetchData2({ variables: { skip: 2000 }, context: { chainId: chain?.id } }),
			fetchData3({ variables: { skip: 3000 }, context: { chainId: chain?.id } })
		])
			.then((values) => contractOddsAllMatches(values))
			.catch((error) => {
				// TODO: handle error notification
				// eslint-disable-next-line no-console
				console.error('Fetch paralel request', error)
			})
	}

	useEffect(() => {
		if ((rawMatches.matches.length === 0 || rawMatches.isFailed) && fetchMeta.fallbackTry < 3) {
			setFetchMeta((current) => ({ fallbackTry: current.fallbackTry + 1 }))
			fetchAllMatches()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain?.id, rawMatches.isFailed])

	return null
}
