import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AvailablePerPosition } from '@/typescript/types'
import QUERY_KEYS from '@/utils/queryKeys'
import networkConnector from '@/utils/networkConnector'
import { PositionNumber } from '@/utils/constants'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import { convertPriceImpactToBonus } from '@/utils/markets'

const useAvailablePerPositionQuery = (marketAddress: string, options?: UseQueryOptions<AvailablePerPosition | undefined>) => {
	return useQuery<any>(
		QUERY_KEYS.AvailablePerPosition(marketAddress),
		async () => {
			try {
				const { sportPositionalMarketDataContract } = networkConnector

				const marketLiquidityAndPriceImpact = await sportPositionalMarketDataContract?.getMarketLiquidityAndPriceImpact(marketAddress)

				return {
					[PositionNumber.HOME]: {
						available: bigNumberFormatter(marketLiquidityAndPriceImpact.homeLiquidity),
						buyBonus: convertPriceImpactToBonus(bigNumberFormatter(marketLiquidityAndPriceImpact.homePriceImpact))
					},
					[PositionNumber.AWAY]: {
						available: bigNumberFormatter(marketLiquidityAndPriceImpact.awayLiquidity),
						buyBonus: convertPriceImpactToBonus(bigNumberFormatter(marketLiquidityAndPriceImpact.awayPriceImpact))
					},
					[PositionNumber.DRAW]: {
						available: bigNumberFormatter(marketLiquidityAndPriceImpact.drawLiquidity),
						buyBonus: convertPriceImpactToBonus(bigNumberFormatter(marketLiquidityAndPriceImpact.drawPriceImpact))
					}
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				return undefined
			}
		},
		{
			...options
		}
	)
}

export default useAvailablePerPositionQuery
