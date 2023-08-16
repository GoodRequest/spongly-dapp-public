import { NetworkId } from './networkConnector'
import { MAX_GAS_LIMIT, NETWORK_IDS, Network, STABLE_DECIMALS } from '@/utils/constants'

export const SUPPORTED_NETWORKS = [
	{
		chainId: NETWORK_IDS.OPTIMISM,
		chainName: 'Optimism Mainnet',
		shortChainName: 'Optimism',
		chainKey: 'optimism_mainnet',
		iconClassName: 'icon icon--op',
		areVaultsSupported: true,
		isMultiCollateralSupported: true
	},
	{
		chainId: NETWORK_IDS.ARBITRUM,
		chainName: 'Arbitrum One',
		shortChainName: 'Arbitrum',
		chainKey: 'arbitrum_mainnet',
		iconClassName: 'icon icon--arb',
		areVaultsSupported: false,
		isMultiCollateralSupported: false
	},
	{
		chainId: NETWORK_IDS.OPTIMISM_GOERLI,
		chainName: 'Optimism Goerli Testnet',
		shortChainName: 'Optimism Goerli Testnet',
		chainKey: 'optimism_mainnet',
		iconClassName: 'icon icon--op',
		areVaultsSupported: true,
		isMultiCollateralSupported: true
	}
]

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
	if (networkId === NETWORK_IDS.ARBITRUM) return STABLE_DECIMALS.USDC
	return STABLE_DECIMALS.sUSD
}

export const getMaxGasLimitForNetwork = (networkId: Network) => {
	if (networkId === NETWORK_IDS.ARBITRUM) return undefined
	return MAX_GAS_LIMIT
}
