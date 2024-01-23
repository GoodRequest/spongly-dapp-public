import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import networkConnector from '@/utils/networkConnector'
import { CRYPTO_CURRENCY_MAP, Network, COLLATERAL_DECIMALS, Coins } from '@/utils/constants'
import QUERY_KEYS from '@/utils/queryKeys'
import { bigNumberFormatter } from '@/utils/formatters/ethers'

const useMultipleCollateralBalanceQuery = (walletAddress: string, networkId: Network, options?: UseQueryOptions<any>) => {
	return useQuery<any>(
		QUERY_KEYS.Wallet.MultipleCollateral(walletAddress, networkId),
		async () => {
			try {
				const { multipleCollateral } = networkConnector

				if (!walletAddress || !networkId) {
					return {
						sUSD: 0,
						DAI: 0,
						USDCe: 0,
						USDT: 0,
						OP: 0,
						WETH: 0,
						ETH: 0,
						ARB: 0,
						USDC: 0
					}
				}

				const [sUSDBalance, DAIBalance, USDCBalance, USDCeBalance, USDTBalance, OPBalance, WETHBalance, ETHBalance, ARBBalance] = await Promise.all([
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.sUSD as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.DAI as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDC as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDCe as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.USDT as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.OP as Coins]?.balanceOf(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.WETH as Coins]?.balanceOf(walletAddress) : undefined,
					networkConnector.provider ? networkConnector.provider.getBalance(walletAddress) : undefined,
					multipleCollateral ? multipleCollateral[CRYPTO_CURRENCY_MAP.ARB as Coins]?.balanceOf(walletAddress) : undefined
				])

				return {
					sUSD: sUSDBalance ? bigNumberFormatter(sUSDBalance, COLLATERAL_DECIMALS.sUSD) : 0,
					DAI: DAIBalance ? bigNumberFormatter(DAIBalance, COLLATERAL_DECIMALS.DAI) : 0,
					USDC: USDCBalance ? bigNumberFormatter(USDCBalance, COLLATERAL_DECIMALS.USDC) : 0,
					USDCe: USDCeBalance ? bigNumberFormatter(USDCeBalance, COLLATERAL_DECIMALS.USDCe) : 0,
					USDT: USDTBalance ? bigNumberFormatter(USDTBalance, COLLATERAL_DECIMALS.USDT) : 0,
					OP: OPBalance ? bigNumberFormatter(OPBalance, COLLATERAL_DECIMALS.OP) : 0,
					WETH: WETHBalance ? bigNumberFormatter(WETHBalance, COLLATERAL_DECIMALS.WETH) : 0,
					ETH: ETHBalance ? bigNumberFormatter(ETHBalance, COLLATERAL_DECIMALS.ETH) : 0,
					ARB: ARBBalance ? bigNumberFormatter(ARBBalance, COLLATERAL_DECIMALS.ARB) : 0
				}
			} catch (e) {
				return {
					sUSD: 0,
					DAI: 0,
					USDCe: 0,
					USDT: 0,
					OP: 0,
					WETH: 0,
					ETH: 0,
					ARB: 0,
					USDC: 0
				}
			}
		},
		options
	)
}

export default useMultipleCollateralBalanceQuery
