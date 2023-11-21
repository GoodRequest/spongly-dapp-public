import { Network } from '@/utils/constants'

const multiCollateralOnOffRampContract = {
	addresses: {
		[Network.OptimismMainnet]: '0x6F5A76423396Bf39F64F8c51C0B3dEb24990b116',
		[Network.OptimismGoerli]: '',
		[Network.ArbitrumOne]: '0x7b065dE3fd7190A6C2CB6D51E946e82B6b2C4358',
		[Network.Base]: '0x0946BfE3c543e0B770B7F7e508c8A566947C4278'
	},
	abi: [
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: '_curveSUSD', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_dai', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_usdc', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_usdt', type: 'address' },
				{ indexed: false, internalType: 'bool', name: '_curveOnrampEnabled', type: 'bool' },
				{ indexed: false, internalType: 'uint256', name: '_maxAllowedPegSlippagePercentage', type: 'uint256' }
			],
			name: 'CurveSUSDSet',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: 'manager', type: 'address' }],
			name: 'ManagerChanged',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'collateral', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'Offramped',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }],
			name: 'OfframpedEth',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'collateral', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'Onramped',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }],
			name: 'OnrampedEth',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'oldOwner', type: 'address' },
				{ indexed: false, internalType: 'address', name: 'newOwner', type: 'address' }
			],
			name: 'OwnerChanged',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: 'newOwner', type: 'address' }],
			name: 'OwnerNominated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'bool', name: 'isPaused', type: 'bool' }],
			name: 'PauseChanged',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'uint256', name: '_maxAllowedSlippage', type: 'uint256' }],
			name: 'SetMaxAllowedPegSlippagePercentage',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'collateral', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: '_maxAllowedSlippagePerCollateral', type: 'uint256' }
			],
			name: 'SetMaxAllowedPegSlippagePercentagePerCollateral',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'asset', type: 'address' },
				{ indexed: false, internalType: 'bytes', name: 'path', type: 'bytes' },
				{ indexed: false, internalType: 'bool', name: 'doReset', type: 'bool' }
			],
			name: 'SetPathPerCollateral',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'asset', type: 'address' },
				{ indexed: false, internalType: 'bytes', name: 'path', type: 'bytes' },
				{ indexed: false, internalType: 'bool', name: 'doReset', type: 'bool' }
			],
			name: 'SetPathPerCollateralOfframp',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_priceFeed', type: 'address' }],
			name: 'SetPriceFeed',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'bytes32', name: 'key', type: 'bytes32' },
				{ indexed: false, internalType: 'address', name: 'asset', type: 'address' }
			],
			name: 'SetPriceFeedKeyPerAsset',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_usd', type: 'address' }],
			name: 'SetSUSD',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'amm', type: 'address' },
				{ indexed: false, internalType: 'bool', name: 'supported', type: 'bool' }
			],
			name: 'SetSupportedAMM',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'collateral', type: 'address' },
				{ indexed: false, internalType: 'bool', name: 'supported', type: 'bool' }
			],
			name: 'SetSupportedCollateral',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_router', type: 'address' }],
			name: 'SetSwapRouter',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_weth', type: 'address' }],
			name: 'SetWETH',
			type: 'event'
		},
		{
			inputs: [],
			name: 'WETH9',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'ammsSupported',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'collateralSupported',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'curveOnrampEnabled',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'curveSUSD',
			outputs: [{ internalType: 'contract ICurveSUSD', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'dai',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'inToken', type: 'address' },
				{ internalType: 'uint24', name: 'feeIn', type: 'uint24' },
				{ internalType: 'address', name: 'proxy', type: 'address' },
				{ internalType: 'uint24', name: 'feeOut', type: 'uint24' },
				{ internalType: 'address', name: 'target', type: 'address' }
			],
			name: 'getEncodedPacked',
			outputs: [{ internalType: 'bytes', name: 'encoded', type: 'bytes' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'getMaximumReceived',
			outputs: [{ internalType: 'uint256', name: 'maxReceived', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'getMaximumReceivedOfframp',
			outputs: [{ internalType: 'uint256', name: 'maxReceivedOfframp', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'getMinimumNeeded',
			outputs: [{ internalType: 'uint256', name: 'minNeeded', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'getMinimumReceived',
			outputs: [{ internalType: 'uint256', name: 'minReceived', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'getMinimumReceivedOfframp',
			outputs: [{ internalType: 'uint256', name: 'minReceivedOfframp', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'initNonReentrant', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: '_owner', type: 'address' },
				{ internalType: 'contract IERC20Upgradeable', name: '_sUSD', type: 'address' }
			],
			name: 'initialize',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'lastPauseTime',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'manager',
			outputs: [{ internalType: 'contract IPositionalMarketManagerTruncated', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'maxAllowedPegSlippagePercentage',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'maxAllowedPegSlippagePercentagePerCollateral',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
			name: 'nominateNewOwner',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'nominatedOwner',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'offramp',
			outputs: [{ internalType: 'uint256', name: 'convertedAmount', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
			name: 'offrampIntoEth',
			outputs: [{ internalType: 'uint256', name: 'convertedAmount', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: 'collateralAmount', type: 'uint256' }
			],
			name: 'onramp',
			outputs: [{ internalType: 'uint256', name: 'convertedAmount', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
			name: 'onrampWithEth',
			outputs: [{ internalType: 'uint256', name: 'convertedAmount', type: 'uint256' }],
			stateMutability: 'payable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'owner',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'pathPerCollateral',
			outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'pathPerCollateralOfframp',
			outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'paused',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'priceFeed',
			outputs: [{ internalType: 'contract IPriceFeed', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'priceFeedKeyPerCollateral',
			outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'sUSD',
			outputs: [{ internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: '_curveSUSD', type: 'address' },
				{ internalType: 'address', name: '_dai', type: 'address' },
				{ internalType: 'address', name: '_usdc', type: 'address' },
				{ internalType: 'address', name: '_usdt', type: 'address' },
				{ internalType: 'bool', name: '_curveOnrampEnabled', type: 'bool' },
				{ internalType: 'uint256', name: '_maxAllowedPegSlippagePercentage', type: 'uint256' }
			],
			name: 'setCurveSUSD',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_manager', type: 'address' }],
			name: 'setManager',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: '_maxAllowedSlippage', type: 'uint256' }],
			name: 'setMaxAllowedPegSlippagePercentage',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'uint256', name: '_maxAllowedSlippagePerCollateral', type: 'uint256' }
			],
			name: 'setMaxAllowedPegSlippagePercentagePerCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
			name: 'setOwner',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'asset', type: 'address' },
				{ internalType: 'bytes', name: 'path', type: 'bytes' },
				{ internalType: 'bool', name: 'doReset', type: 'bool' }
			],
			name: 'setPathPerCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'asset', type: 'address' },
				{ internalType: 'bytes', name: 'path', type: 'bytes' },
				{ internalType: 'bool', name: 'doReset', type: 'bool' }
			],
			name: 'setPathPerCollateralOfframp',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'bool', name: '_paused', type: 'bool' }],
			name: 'setPaused',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_priceFeed', type: 'address' }],
			name: 'setPriceFeed',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'bytes32', name: 'key', type: 'bytes32' },
				{ internalType: 'address', name: 'asset', type: 'address' }
			],
			name: 'setPriceFeedKeyPerAsset',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_usd', type: 'address' }],
			name: 'setSUSD',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'amm', type: 'address' },
				{ internalType: 'bool', name: 'supported', type: 'bool' }
			],
			name: 'setSupportedAMM',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'bool', name: 'supported', type: 'bool' }
			],
			name: 'setSupportedCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_router', type: 'address' }],
			name: 'setSwapRouter',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_weth', type: 'address' }],
			name: 'setWETH',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'swapRouter',
			outputs: [{ internalType: 'contract ISwapRouter', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: 'proxyAddress', type: 'address' }],
			name: 'transferOwnershipAtInit',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'usdc',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'usdt',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ stateMutability: 'payable', type: 'receive' }
	]
}

export default multiCollateralOnOffRampContract
