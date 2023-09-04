import { NetworkId } from './networkConnector'
import { NETWORK_IDS, Network, STABLE_DECIMALS } from '@/utils/constants'
import OptimismIcon from '@/assets/icons/optimism-icon.svg'

type OptimismNetwork = {
	chainId: string
	chainName: string
	rpcUrls: string[]
	blockExplorerUrls: string[]
	iconUrls: string[]
	fraudProofWindow?: number
	nativeCurrency: {
		symbol: string
		decimals: number
	}
}

export const NETWORK_SWITCHER_SUPPORTED_NETWORKS = [
	{
		chainId: NETWORK_IDS.OPTIMISM,
		networkId: '0xA',
		chainName: 'Optimism Mainnet',
		shortChainName: 'Optimism',
		chainKey: 'optimism_mainnet',
		icon: OptimismIcon
	}
]

export const SUPPORTED_NETWORKS_DESCRIPTIONS: Record<number, OptimismNetwork> = {
	[Network.OptimismMainnet]: {
		chainId: '0xA',
		chainName: 'Optimism',
		rpcUrls: ['https://mainnet.optimism.io'],
		blockExplorerUrls: ['https://optimistic.etherscan.io/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	},
	[Network.OptimismGoerli]: {
		chainId: '0x420',
		chainName: 'Optimism Goerli',
		rpcUrls: ['https://goerli.optimism.io/'],
		blockExplorerUrls: ['https://goerli-optimism.etherscan.io/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	},
	[Network.ArbitrumOne]: {
		chainId: '0xA4B1',
		chainName: 'Arbitrum One',
		rpcUrls: ['https://arb1.arbitrum.io/rpc'],
		blockExplorerUrls: ['https://arbiscan.io/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	}
}

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
	if (networkId === NETWORK_IDS.ARBITRUM) return STABLE_DECIMALS.USDC
	return STABLE_DECIMALS.sUSD
}

export const hasEthereumInjected = () => !!window.ethereum
