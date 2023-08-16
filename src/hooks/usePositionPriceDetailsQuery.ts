import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { getDefaultDecimalsForNetwork } from '@/utils/network'
import { bigNumberFormatter, bigNumberFormmaterWithDecimals } from '@/utils/formatters/ethers'
import networkConnector, { NetworkId } from '@/utils/networkConnector'
import { PositionNumber, ZERO_ADDRESS } from '@/utils/constants'
import QUERY_KEYS from '@/utils/queryKeys'

export type AMMPosition = {
	available: number
	quote: number
	priceImpact: number
}

const usePositionPriceDetailsQuery = (
	marketAddress: string,
	position: PositionNumber,
	amount: number,
	stableIndex: number,
	networkId: NetworkId,
	options?: UseQueryOptions<AMMPosition>
) => {
	return useQuery<AMMPosition>(
		QUERY_KEYS.PositionDetails(marketAddress, position, amount, stableIndex, networkId),
		async () => {
			if (!marketAddress)
				return {
					available: 0,
					quote: 0,
					priceImpact: 0
				}

			try {
				const { sportPositionalMarketDataContract } = networkConnector
				const parsedAmount = ethers.utils.parseEther(amount.toString())

				const positionDetails = await sportPositionalMarketDataContract?.getPositionDetails(marketAddress, position, parsedAmount, ZERO_ADDRESS)

				return {
					available: bigNumberFormatter(positionDetails.liquidity),
					quote: bigNumberFormmaterWithDecimals(
						/* isMultiCollateral ? positionDetails.quoteDifferentCollateral : */ positionDetails.quote,
						/* isMultiCollateral ? getStablecoinDecimals(networkId, stableIndex) : */ getDefaultDecimalsForNetwork(networkId)
					),
					priceImpact: bigNumberFormatter(positionDetails.priceImpact)
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('Error ', e)
				return {
					available: 0,
					quote: 0,
					priceImpact: 0
				}
			}
		},
		{
			...options
		}
	)
}

export default usePositionPriceDetailsQuery
