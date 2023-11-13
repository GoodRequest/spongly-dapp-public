import { Chain } from 'wagmi'
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
	},
	{
		chainId: NETWORK_IDS.ARBITRUM,
		networkId: '0xA4B1',
		chainName: 'Arbitrum One',
		shortChainName: 'Arbitrum',
		chainKey: 'arbitrum_mainnet',
		icon: OptimismIcon
	},
	{
		chainId: NETWORK_IDS.BASE,
		networkId: '0x2105',
		chainName: 'Base Mainnet',
		shortChainName: 'Base',
		chainKey: 'base_mainnet',
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
	},
	[Network.Base]: {
		chainId: '0x2105',
		chainName: 'Base Mainnet',
		rpcUrls: ['https://mainnet.base.org'],
		blockExplorerUrls: ['https://basescan.org/'],
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

// configuration for wagmi
export const base = {
	id: 8453,
	network: 'base',
	name: 'Base',
	nativeCurrency: { name: 'Base', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.base.org']
		},
		public: {
			http: ['https://mainnet.base.org']
		}
	},
	blockExplorers: {
		blockscout: {
			name: 'Basescout',
			url: 'https://base.blockscout.com'
		},
		default: {
			name: 'Basescan',
			url: 'https://basescan.org'
		},
		etherscan: {
			name: 'Basescan',
			url: 'https://basescan.org'
		}
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 5022
		}
	}
} as Chain
