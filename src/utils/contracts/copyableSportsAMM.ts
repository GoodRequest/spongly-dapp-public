import { Network } from '@/utils/constants'

const copyableParlayAMM = {
	addresses: {
		5: '',
		10: '',
		42: '',
		[Network.OptimismGoerli]: '0xE3cfdCB451ceC026CE2e9F93bd671801E5BB5FFb',
		42161: ''
	},
	abi: [
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'sportsAMMAddress',
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
					indexed: true,
					internalType: 'string',
					name: 'marketID',
					type: 'string'
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'walletAddress',
					type: 'address'
				}
			],
			name: 'MarketCopied',
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
			inputs: [],
			name: 'acceptOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_sportMarket',
					type: 'address'
				},
				{
					internalType: 'enum ISportsAMM.Position',
					name: '_position',
					type: 'uint8'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				},
				{
					internalType: 'uint256',
					name: '_additionalSlippage',
					type: 'uint256'
				},
				{
					internalType: 'uint256',
					name: '_expectedPayout',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: '_refferer',
					type: 'address'
				},
				{
					internalType: 'string',
					name: '_copiedFromMarket',
					type: 'string'
				}
			],
			name: 'buyFromAMMWithCopy',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '_sportMarket',
					type: 'address'
				},
				{
					internalType: 'enum ISportsAMM.Position',
					name: '_position',
					type: 'uint8'
				},
				{
					internalType: 'uint256',
					name: '_sUSDPaid',
					type: 'uint256'
				},
				{
					internalType: 'uint256',
					name: '_additionalSlippage',
					type: 'uint256'
				},
				{
					internalType: 'uint256',
					name: '_expectedPayout',
					type: 'uint256'
				},
				{
					internalType: 'address',
					name: '_collateral',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_refferer',
					type: 'address'
				},
				{
					internalType: 'string',
					name: '_copiedFromMarket',
					type: 'string'
				}
			],
			name: 'buyFromParlayWithCopyAndDifferentCollateral',
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
					internalType: 'string',
					name: '_marketAddress',
					type: 'string'
				}
			],
			name: 'getCopiedMarketDetails',
			outputs: [
				{
					components: [
						{
							internalType: 'bool',
							name: 'wasCopied',
							type: 'bool'
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
					internalType: 'struct CopyableSportsAMM.CopiedMarketDetails',
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
					internalType: 'string',
					name: '_marketAddress',
					type: 'string'
				}
			],
			name: 'getMarketCopiedCount',
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
					internalType: 'string',
					name: '_marketAddress',
					type: 'string'
				}
			],
			name: 'getMarketWallets',
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
			name: 'getWalletMarkets',
			outputs: [
				{
					internalType: 'string[]',
					name: '',
					type: 'string[]'
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
					name: '_sportsAMMAddress',
					type: 'address'
				},
				{
					internalType: 'contract IERC20Upgradeable',
					name: '_sUSD',
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
					name: '_sportsAMMAddress',
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
