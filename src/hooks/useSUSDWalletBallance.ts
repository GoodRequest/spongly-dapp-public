import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Network, STABLE_DECIMALS } from '@/utils/constants'
import networkConnector from '../utils/networkConnector'
import QUERY_KEYS from '@/utils/queryKeys'

const useSUSDWalletBalance = (walletAddress: string, networkId: Network, options?: UseQueryOptions<number | undefined>) => {
	return useQuery<number | undefined>(
		QUERY_KEYS.Wallet.GetsUSDWalletBalance(walletAddress, networkId),
		async () => {
			try {
				const { sUSDContract } = networkConnector
				if (sUSDContract && walletAddress) {
					const balance = await sUSDContract?.balanceOf(walletAddress)
					return parseInt(balance) / 10 ** STABLE_DECIMALS.sUSD
				}
				return 0
			} catch (e) {
				// TODO NOTIFICATION
				// eslint-disable-next-line
				console.error(e)
				return undefined
			}
		},
		{
			refetchInterval: 5000,
			...options
		}
	)
}

export default useSUSDWalletBalance
