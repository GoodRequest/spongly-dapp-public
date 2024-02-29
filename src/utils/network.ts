import { Chain } from 'wagmi'
import { NetworkId } from './networkConnector'
import { NETWORK_IDS, Network } from '@/utils/constants'
import OptimismIcon from '@/assets/icons/optimism-icon.svg'
import ArbitrumIcon from '@/assets/icons/arbitrum-icon.svg'
import BaseIcon from '@/assets/icons/base-icon.svg'

export const NETWORK_SWITCHER_SUPPORTED_NETWORKS = [
	{
		chainId: NETWORK_IDS.OPTIMISM,
		networkId: '0xA',
		chainName: 'Optimism',
		rpcUrls: ['https://mainnet.optimism.io'],
		blockExplorerUrls: ['https://optimistic.etherscan.io/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		icon: OptimismIcon,
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	},
	{
		chainId: NETWORK_IDS.ARBITRUM,
		networkId: '0xA4B1',
		chainName: 'Arbitrum One',
		rpcUrls: ['https://arb1.arbitrum.io/rpc'],
		blockExplorerUrls: ['https://arbiscan.io/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		icon: ArbitrumIcon,
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	},
	{
		chainId: NETWORK_IDS.BASE,
		networkId: '0x2105',
		chainName: 'Base',
		rpcUrls: ['https://mainnet.base.org'],
		blockExplorerUrls: ['https://basescan.org/'],
		iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
		icon: BaseIcon,
		nativeCurrency: {
			symbol: 'ETH',
			decimals: 18
		}
	}
]

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
	if ([Network.ArbitrumOne, Network.Base].includes(networkId)) return 6
	return 18
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
