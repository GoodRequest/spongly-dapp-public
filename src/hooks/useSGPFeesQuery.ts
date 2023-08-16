import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Network } from '@/utils/constants'
import QUERY_KEYS from '@/utils/queryKeys'
import networkConnector from '@/utils/networkConnector'
import { SGPContractData, SGPItem } from '@/typescript/types'
import { convertSGPContractDataToSGPItemType } from '@/utils/helpers'

const useSGPFeesQuery = (networkId: Network, options?: UseQueryOptions<SGPItem[] | undefined>) => {
	return useQuery<SGPItem[] | undefined>(
		QUERY_KEYS.SGPFees(networkId),
		async () => {
			try {
				const { parlayMarketDataContract } = networkConnector

				if (parlayMarketDataContract) {
					const response: SGPContractData = await parlayMarketDataContract?.getAllSGPFees()

					if (!response) return [] as SGPItem[]
					return convertSGPContractDataToSGPItemType(response)
				}

				return [] as SGPItem[]
			} catch (e) {
				// eslint-disable-next-line no-console
				console.log(e)
				return [] as SGPItem[]
			}
		},
		{
			...options
		}
	)
}

export default useSGPFeesQuery
