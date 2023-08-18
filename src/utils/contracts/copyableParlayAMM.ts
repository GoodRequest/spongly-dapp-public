import { Network } from '@/utils/constants'

const copyableParlayAMM = {
	addresses: {
		5: '',
		10: '',
		42: '',
		[Network.OptimismGoerli]: '0x7A5be4Ff6d68fEEB82D1cA72e2A5083e62A8cC43',
		42161: ''
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
					name: 'parlayAddress',
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
					name: '_differentRecepient',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_refferer',
					type: 'address'
				},
				{
					internalType: 'address',
					name: '_copiedFromParlay',
					type: 'address'
				},
				{
					internalType: 'bool',
					name: '_modified',
					type: 'bool'
				}
			],
			name: 'buyFromParlayWithCopy',
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
					internalType: 'address',
					name: '_copiedFromParlay',
					type: 'address'
				},
				{
					internalType: 'bool',
					name: '_modified',
					type: 'bool'
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
							name: 'modifiedCount',
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
					internalType: 'uint256[2]',
					name: '',
					type: 'uint256[2]'
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
					name: '_parlayMarketsAMM',
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
