import { Network } from '@/utils/constants'

export const sportsAMMContract = {
	addresses: {
		[Network.OptimismMainnet]: '0x170a5714112daEfF20E798B6e92e25B86Ea603C1',
		[Network.OptimismGoerli]: '0x7465c5d60d3d095443CF9991Da03304A30D42Eae',
		[Network.ArbitrumOne]: '0xae56177e405929c95E5d4b04C0C87E428cB6432B',
		[Network.Base]: '0xAFD339acf24813e8038bfdF19A8d87Eb94B4605d'
	},
	abi: [
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: '_safeBox', type: 'address' },
				{ indexed: false, internalType: 'contract IERC20Upgradeable', name: '_sUSD', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_theRundownConsumer', type: 'address' },
				{ indexed: false, internalType: 'contract IStakingThales', name: '_stakingThales', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_referrals', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_parlayAMM', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_wrapper', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_lp', type: 'address' },
				{ indexed: false, internalType: 'address', name: '_riskManager', type: 'address' }
			],
			name: 'AddressesUpdated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'buyer', type: 'address' },
				{ indexed: false, internalType: 'address', name: 'market', type: 'address' },
				{ indexed: false, internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'sUSDPaid', type: 'uint256' },
				{ indexed: false, internalType: 'address', name: 'susd', type: 'address' },
				{ indexed: false, internalType: 'address', name: 'asset', type: 'address' }
			],
			name: 'BoughtFromAmm',
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
			inputs: [
				{ indexed: false, internalType: 'uint256', name: '_minimalTimeLeftToMaturity', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_minSpread', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_maxSpread', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_minSupportedOdds', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_maxSupportedOdds', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_safeBoxImpact', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: '_referrerFee', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'threshold', type: 'uint256' }
			],
			name: 'ParametersUpdated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
			name: 'Paused',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'refferer', type: 'address' },
				{ indexed: false, internalType: 'address', name: 'trader', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'volume', type: 'uint256' }
			],
			name: 'ReferrerPaid',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: '_onramper', type: 'address' },
				{ indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' }
			],
			name: 'SetMultiCollateralOnOffRamp',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_manager', type: 'address' }],
			name: 'SetSportsPositionalMarketManager',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
			name: 'Unpaused',
			type: 'event'
		},
		{
			inputs: [],
			name: 'TAG_NUMBER_PLAYERS',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' }
			],
			name: 'availableToBuyFromAMM',
			outputs: [{ internalType: 'uint256', name: '_available', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'uint256', name: 'expectedPayout', type: 'uint256' },
				{ internalType: 'uint256', name: 'additionalSlippage', type: 'uint256' }
			],
			name: 'buyFromAMM',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'uint256', name: 'expectedPayout', type: 'uint256' },
				{ internalType: 'uint256', name: 'additionalSlippage', type: 'uint256' },
				{ internalType: 'address', name: 'collateral', type: 'address' }
			],
			name: 'buyFromAMMWithDifferentCollateral',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'uint256', name: 'expectedPayout', type: 'uint256' },
				{ internalType: 'uint256', name: 'additionalSlippage', type: 'uint256' },
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'address', name: '_referrer', type: 'address' }
			],
			name: 'buyFromAMMWithDifferentCollateralAndReferrer',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'uint256', name: 'expectedPayout', type: 'uint256' },
				{ internalType: 'uint256', name: 'additionalSlippage', type: 'uint256' },
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'address', name: '_referrer', type: 'address' }
			],
			name: 'buyFromAMMWithEthAndReferrer',
			outputs: [],
			stateMutability: 'payable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'uint256', name: 'expectedPayout', type: 'uint256' },
				{ internalType: 'uint256', name: 'additionalSlippage', type: 'uint256' },
				{ internalType: 'address', name: '_referrer', type: 'address' }
			],
			name: 'buyFromAMMWithReferrer',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'buyFromAmmQuote',
			outputs: [{ internalType: 'uint256', name: '_quote', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'buyFromAmmQuoteForParlayAMM',
			outputs: [{ internalType: 'uint256', name: '_quote', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'address', name: 'collateral', type: 'address' }
			],
			name: 'buyFromAmmQuoteWithDifferentCollateral',
			outputs: [
				{ internalType: 'uint256', name: 'collateralQuote', type: 'uint256' },
				{ internalType: 'uint256', name: 'sUSDToPay', type: 'uint256' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: 'position', type: 'uint8' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' }
			],
			name: 'buyPriceImpact',
			outputs: [{ internalType: 'int256', name: 'impact', type: 'int256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: 'market', type: 'address' },
				{ internalType: 'address', name: 'collateral', type: 'address' },
				{ internalType: 'bool', name: 'toEth', type: 'bool' }
			],
			name: 'exerciseWithOfframp',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: '_market', type: 'address' },
				{ internalType: 'bool', name: 'isSell', type: 'bool' }
			],
			name: 'getMarketDefaultOdds',
			outputs: [{ internalType: 'uint256[]', name: 'odds', type: 'uint256[]' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'initNonReentrant', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: '_owner', type: 'address' },
				{ internalType: 'contract IERC20Upgradeable', name: '_sUSD', type: 'address' },
				{ internalType: 'uint256', name: '_min_spread', type: 'uint256' },
				{ internalType: 'uint256', name: '_max_spread', type: 'uint256' },
				{ internalType: 'uint256', name: '_minimalTimeLeftToMaturity', type: 'uint256' }
			],
			name: 'initialize',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: 'market', type: 'address' }],
			name: 'isMarketInAMMTrading',
			outputs: [{ internalType: 'bool', name: 'isTrading', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'liquidityPool',
			outputs: [{ internalType: 'contract SportAMMLiquidityPool', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'manager',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
			inputs: [],
			name: 'maxSupportedOdds',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'max_spread',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'minSupportedOdds',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'min_spread',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'min_spreadPerAddress',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'minimalTimeLeftToMaturity',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'multiCollateralOnOffRamp',
			outputs: [{ internalType: 'contract IMultiCollateralOnOffRamp', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'multicollateralEnabled',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
				{ internalType: 'address', name: '_market', type: 'address' },
				{ internalType: 'enum ISportsAMM.Position', name: '_position', type: 'uint8' }
			],
			name: 'obtainOdds',
			outputs: [{ internalType: 'uint256', name: 'oddsToReturn', type: 'uint256' }],
			stateMutability: 'view',
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
			inputs: [],
			name: 'parlayAMM',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
			name: 'referrals',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'referrerFee',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'riskManager',
			outputs: [{ internalType: 'contract ISportAMMRiskManager', name: '', type: 'address' }],
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
			inputs: [],
			name: 'safeBox',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'safeBoxFeePerAddress',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'safeBoxImpact',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: '_safeBox', type: 'address' },
				{ internalType: 'contract IERC20Upgradeable', name: '_sUSD', type: 'address' },
				{ internalType: 'address', name: '_theRundownConsumer', type: 'address' },
				{ internalType: 'contract IStakingThales', name: '_stakingThales', type: 'address' },
				{ internalType: 'address', name: '_referrals', type: 'address' },
				{ internalType: 'address', name: '_parlayAMM', type: 'address' },
				{ internalType: 'address', name: '_wrapper', type: 'address' },
				{ internalType: 'address', name: '_lp', type: 'address' },
				{ internalType: 'address', name: '_riskManager', type: 'address' }
			],
			name: 'setAddresses',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'contract SportsAMMUtils', name: '_ammUtils', type: 'address' }],
			name: 'setAmmUtils',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: '_onramper', type: 'address' },
				{ internalType: 'bool', name: 'enabled', type: 'bool' }
			],
			name: 'setMultiCollateralOnOffRamp',
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
				{ internalType: 'uint256', name: '_minimalTimeLeftToMaturity', type: 'uint256' },
				{ internalType: 'uint256', name: '_minSpread', type: 'uint256' },
				{ internalType: 'uint256', name: '_maxSpread', type: 'uint256' },
				{ internalType: 'uint256', name: '_minSupportedOdds', type: 'uint256' },
				{ internalType: 'uint256', name: '_maxSupportedOdds', type: 'uint256' },
				{ internalType: 'uint256', name: '_safeBoxImpact', type: 'uint256' },
				{ internalType: 'uint256', name: '_referrerFee', type: 'uint256' },
				{ internalType: 'uint256', name: '_threshold', type: 'uint256' }
			],
			name: 'setParameters',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'bool', name: '_setPausing', type: 'bool' }],
			name: 'setPaused',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'address', name: '_address', type: 'address' },
				{ internalType: 'uint256', name: 'newSBFee', type: 'uint256' },
				{ internalType: 'uint256', name: 'newMSFee', type: 'uint256' }
			],
			name: 'setSafeBoxFeeAndMinSpreadPerAddress',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_manager', type: 'address' }],
			name: 'setSportsPositionalMarketManager',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'spentOnGame',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '', type: 'address' }],
			name: 'spentOnParent',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'sportAmmUtils',
			outputs: [{ internalType: 'contract SportsAMMUtils', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'stakingThales',
			outputs: [{ internalType: 'contract IStakingThales', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'theRundownConsumer',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'thresholdForOddsUpdate',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
			inputs: [
				{ internalType: 'address', name: '_account', type: 'address' },
				{ internalType: 'uint256', name: '_amount', type: 'uint256' }
			],
			name: 'updateParlayVolume',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'wrapper',
			outputs: [{ internalType: 'contract ITherundownConsumerWrapper', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ stateMutability: 'payable', type: 'receive' }
	]
}

export default sportsAMMContract
