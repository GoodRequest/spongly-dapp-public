// eslint-disable-next-line import/no-cycle
import { NETWORK_IDS, STABLE_DECIMALS } from './constants'
import { NetworkId } from './networkConnector'

export type StablecoinKey = 'sUSD' | 'USDC' | 'USDT' | 'DAI'

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
	if (networkId === NETWORK_IDS.ARBITRUM) return STABLE_DECIMALS.USDC
	return STABLE_DECIMALS.sUSD
}
