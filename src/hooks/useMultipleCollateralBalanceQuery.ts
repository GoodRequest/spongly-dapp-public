import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import networkConnector from '@/utils/networkConnector'
import { COLLATERALS_INDEX, Network, STABLE_DECIMALS } from '@/utils/constants'
import { MutipleCollateralBalance } from '@/typescript/types'
import QUERY_KEYS from '@/utils/queryKeys'

const useMultipleCollateralBalanceQuery = (walletAddress: string, networkId: Network, options?: UseQueryOptions<any>) => {
	return useQuery<MutipleCollateralBalance>(
		QUERY_KEYS.Wallet.MultipleCollateral(walletAddress, networkId),
		async () => {
			try {
				const { multipleCollateral } = networkConnector

				if (!walletAddress || !networkId) {
					return {
						sUSD: 0,
						DAI: 0,
						USDC: 0,
						USDT: 0
					}
				}

				const [sUSDBalance, DAIBalance, USDCBalance, USDTBalance] = await Promise.all([
					multipleCollateral?.length ? multipleCollateral[COLLATERALS_INDEX.sUSD]?.balanceOf(walletAddress) : undefined,
					multipleCollateral?.length ? multipleCollateral[COLLATERALS_INDEX.DAI]?.balanceOf(walletAddress) : undefined,
					multipleCollateral?.length ? multipleCollateral[COLLATERALS_INDEX.USDC]?.balanceOf(walletAddress) : undefined,
					multipleCollateral?.length ? multipleCollateral[COLLATERALS_INDEX.USDT]?.balanceOf(walletAddress) : undefined
				])
				return {
					sUSD: sUSDBalance ? parseInt(sUSDBalance) / 10 ** STABLE_DECIMALS.sUSD : 0,
					DAI: DAIBalance ? parseInt(DAIBalance) / 10 ** STABLE_DECIMALS.DAI : 0,
					USDC: USDCBalance ? parseInt(USDCBalance) / 10 ** STABLE_DECIMALS.USDC : 0,
					USDT: USDTBalance ? parseInt(USDTBalance) / 10 ** STABLE_DECIMALS.USDT : 0
				}
			} catch (e) {
				// eslint-disable-next-line
				console.error( e)
				return {
					sUSD: 0,
					DAI: 0,
					USDC: 0,
					USDT: 0
				}
			}
		},
		options
	)
}

export default useMultipleCollateralBalanceQuery
