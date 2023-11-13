import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { bigNumberFormatter } from '@/utils/formatters/ethers'
import networkConnector, { NetworkId } from '@/utils/networkConnector'
import { ParlayAmmData } from '@/redux/betTickets/betTicketTypes'
import { getDefaultDecimalsForNetwork } from '@/utils/network'

const useParlayAmmDataQuery = (networkId: number, options?: UseQueryOptions<ParlayAmmData | undefined>) => {
	return useQuery<ParlayAmmData | undefined>(
		['multipleCollateral', networkId],
		async () => {
			try {
				const parlayData: ParlayAmmData = {
					minUsdAmount: 0,
					maxSupportedAmount: 0,
					maxSupportedOdds: 0,
					parlayAmmFee: 0,
					safeBoxImpact: 0,
					parlaySize: 0
				}

				const { parlayMarketDataContract } = networkConnector
				if (parlayMarketDataContract) {
					const parlayAMMParameters = await parlayMarketDataContract.getParlayAMMParameters()

					parlayData.minUsdAmount = bigNumberFormatter(parlayAMMParameters.minUSDAmount, getDefaultDecimalsForNetwork(networkId as NetworkId))
					parlayData.maxSupportedAmount = bigNumberFormatter(parlayAMMParameters.maxSupportedAmount)
					parlayData.maxSupportedOdds = bigNumberFormatter(parlayAMMParameters.maxSupportedOdds)
					parlayData.parlayAmmFee = bigNumberFormatter(parlayAMMParameters.parlayAmmFee)
					parlayData.safeBoxImpact = bigNumberFormatter(parlayAMMParameters.safeBoxImpact)
					parlayData.parlaySize = Number(parlayAMMParameters.parlaySize)
				}

				return parlayData
			} catch (e) {
				// eslint-disable-next-line no-console
				console.log(e)
				return undefined
			}
		},
		{
			...options
		}
	)
}

export default useParlayAmmDataQuery
