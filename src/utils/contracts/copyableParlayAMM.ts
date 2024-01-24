import { Network } from '@/utils/constants'

const copyableParlayAMM = {
	// TODO: Miso posle adresy pre siete ked dorobi
	addresses: {
		[Network.OptimismMainnet]: '',
		[Network.OptimismGoerli]: '0x407085F8a5C4B9ED06d4b18e7A14d266b3C64EaB',
		[Network.ArbitrumOne]: '',
		[Network.Base]: ''
	},
	abi: [
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: '_parlayMarketsAMM',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'address',
					name: '_parlayMarketData',
					type: 'address'
				}
			],
			name: 'AddressesSet',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'curveSUSD',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'address',
					name: 'dai',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'address',
					name: 'usdc',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'address',
					name: 'usdt',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'bool',
					name: 'curveOnrampEnabled',
					type: 'bool'
				}
			],
			name: 'CurveParametersUpdated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'uint8',
					name: 'version',
					type: 'uint8'
				}
			],
			name: 'Initialized',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'oldOwner',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'address',
					name: 'newOwner',
					type: 'address'
				}
			],
			name: 'OwnerChanged',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'newOwner',
					type: 'address'
				}
			],
			name: 'OwnerNominated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'ticketAddress',
					type: 'address'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'walletAddress',
					type: 'address'
				}
			],
			name: 'ParlayCopied',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'bool',
					name: 'isPaused',
					type: 'bool'
				}
			],
			name: 'PauseChanged',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'reffererAddress',
					type: 'address'
				}
			],
			name: 'ReffererUpdated',
			type: 'event'
		},
		{
			inputs: [],
			name: 'acceptOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address[]',
					name: '_sportMarkets',
					type: 'address[]'
				},
				{
					internalType: 'uint256[]',
					name: '_positions',
					type: 'uint256[]'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				}
			],
			name: 'buyFromParlay',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address[]',
					name: '_sportMarkets',
					type: 'address[]'
				},
				{
					internalType: 'uint256[]',
					name: '_positions',
					type: 'uint256[]'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: '_collateral',
					type: 'address'
				}
			],
			name: 'buyFromParlayWithDifferentCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayAddress',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				}
			],
			name: 'copyFromParlay',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayAddress',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: '_collateral',
					type: 'address'
				}
			],
			name: 'copyFromParlayWithDifferentCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'curveOnrampEnabled',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'curveSUSD',
			outputs: [
				{
					internalType: 'contract ICurveSUSD',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'dai',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayAddress',
					type: 'address'
				}
			],
			name: 'getCopiedParlayDetails',
			outputs: [
				{
					components: [
						{
							internalType: 'address',
							name: 'owner',
							type: 'address'
						},
						{
							internalType: 'uint256',
							name: 'copiedCount',
							type: 'uint256'
						},
						{
							internalType: 'uint256',
							name: 'lastCopiedTime',
							type: 'uint256'
						}
					],
					internalType: 'struct CopyableParlayAMM.CopiedParlayDetails',
					name: '',
					type: 'tuple'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayAddress',
					type: 'address'
				}
			],
			name: 'getParlayCopiedCount',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayAddress',
					type: 'address'
				}
			],
			name: 'getParlayWallets',
			outputs: [
				{
					internalType: 'address[]',
					name: '',
					type: 'address[]'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_walletAddress',
					type: 'address'
				}
			],
			name: 'getWalletParlays',
			outputs: [
				{
					internalType: 'address[]',
					name: '',
					type: 'address[]'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'initNonReentrant',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_owner',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_parlayMarketsAMMAddress',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_parlayMarketDataAddress',
					type: 'address'
				},
				{
					internalType: 'contract IERC20Upgradeable',
					name: '_sUSD',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_referrer',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: '_maxAllowedPegSlippagePercentage',
					type: 'uint256'
				}
			],
			name: 'initialize',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'lastPauseTime',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'maxAllowedPegSlippagePercentage',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_owner',
					type: 'address'
				}
			],
			name: 'nominateNewOwner',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'nominatedOwner',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'owner',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'paused',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address payable',
					name: 'account',
					type: 'address'
				},
				{
					internalType: 'uint256',
					name: 'amount',
					type: 'uint256'
				}
			],
			name: 'retrieveSUSDAmount',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'sUSD',
			outputs: [
				{
					internalType: 'contract IERC20Upgradeable',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_parlayMarketsAMM',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_parlayMarketData',
					type: 'address'
				}
			],
			name: 'setAddresses',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_curveSUSD',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_dai',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_usdc',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_usdt',
					type: 'address'
				},
				{
					internalType: 'bool',
					name: '_curveOnrampEnabled',
					type: 'bool'
				},
				{
					internalType: 'uint256',
					name: '_maxAllowedPegSlippagePercentage',
					type: 'uint256'
				}
			],
			name: 'setCurveSUSD',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_owner',
					type: 'address'
				}
			],
			name: 'setOwner',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'bool',
					name: '_paused',
					type: 'bool'
				}
			],
			name: 'setPaused',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_refferer',
					type: 'address'
				}
			],
			name: 'setRefferer',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'proxyAddress',
					type: 'address'
				}
			],
			name: 'transferOwnershipAtInit',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'usdc',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'usdt',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address'
				}
			],
			stateMutability: 'view',
			type: 'function'
		}
	]
}

export default copyableParlayAMM
