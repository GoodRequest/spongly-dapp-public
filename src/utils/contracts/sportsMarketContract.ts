export const sportsMarketContract = {
	abi: [
		{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: 'beneficiary', type: 'address' }],
			name: 'Expired',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'enum ISportPositionalMarket.Side', name: 'result', type: 'uint8' },
				{ indexed: false, internalType: 'uint256', name: 'deposited', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'poolFees', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'creatorFees', type: 'uint256' }
			],
			name: 'MarketResolved',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'enum ISportPositionalMarket.Side', name: 'side', type: 'uint8' },
				{ indexed: true, internalType: 'address', name: 'account', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
			],
			name: 'Mint',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'account', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
			],
			name: 'OptionsBurned',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'account', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
			],
			name: 'OptionsExercised',
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
			inputs: [{ indexed: false, internalType: 'bool', name: '_paused', type: 'bool' }],
			name: 'PauseUpdated',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_address', type: 'address' }],
			name: 'SetTherundownConsumer',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'address', name: '_address', type: 'address' }],
			name: 'SetsUSD',
			type: 'event'
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'uint256', name: 'homeOdds', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'awayOdds', type: 'uint256' },
				{ indexed: false, internalType: 'uint256', name: 'drawOdds', type: 'uint256' }
			],
			name: 'StoredOddsOnCancellation',
			type: 'event'
		},
		{ inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [],
			name: 'awayOddsOnCancellation',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
			name: 'balancesOf',
			outputs: [
				{ internalType: 'uint256', name: 'home', type: 'uint256' },
				{ internalType: 'uint256', name: 'away', type: 'uint256' },
				{ internalType: 'uint256', name: 'draw', type: 'uint256' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
			name: 'burnOptions',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{ inputs: [], name: 'burnOptionsMaximum', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [
				{ internalType: 'uint256', name: '_homeBalance', type: 'uint256' },
				{ internalType: 'uint256', name: '_awayBalance', type: 'uint256' },
				{ internalType: 'uint256', name: '_drawBalance', type: 'uint256' }
			],
			name: 'calculatePayoutOnCancellation',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'canResolve',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'cancelled',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'creator',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'deposited',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'drawOddsOnCancellation',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'exerciseOptions', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [{ internalType: 'address payable', name: 'beneficiary', type: 'address' }],
			name: 'expire',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'finalResult',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'gameDetails',
			outputs: [
				{ internalType: 'bytes32', name: 'gameId', type: 'bytes32' },
				{ internalType: 'string', name: 'gameLabel', type: 'string' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'getGameDetails',
			outputs: [
				{ internalType: 'bytes32', name: 'gameId', type: 'bytes32' },
				{ internalType: 'string', name: 'gameLabel', type: 'string' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'getGameId',
			outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
			name: 'getMaximumBurnable',
			outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'getOptions',
			outputs: [
				{ internalType: 'contract IPosition', name: 'home', type: 'address' },
				{ internalType: 'contract IPosition', name: 'away', type: 'address' },
				{ internalType: 'contract IPosition', name: 'draw', type: 'address' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'getStampedOdds',
			outputs: [
				{ internalType: 'uint256', name: '', type: 'uint256' },
				{ internalType: 'uint256', name: '', type: 'uint256' },
				{ internalType: 'uint256', name: '', type: 'uint256' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'homeOddsOnCancellation',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'initialMint',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{
					components: [
						{ internalType: 'address', name: 'owner', type: 'address' },
						{ internalType: 'contract IERC20', name: 'sUSD', type: 'address' },
						{ internalType: 'address', name: 'creator', type: 'address' },
						{ internalType: 'bytes32', name: 'gameId', type: 'bytes32' },
						{ internalType: 'string', name: 'gameLabel', type: 'string' },
						{ internalType: 'uint256[2]', name: 'times', type: 'uint256[2]' },
						{ internalType: 'uint256', name: 'deposit', type: 'uint256' },
						{ internalType: 'address', name: 'theRundownConsumer', type: 'address' },
						{ internalType: 'address', name: 'sportsAMM', type: 'address' },
						{ internalType: 'uint256', name: 'positionCount', type: 'uint256' },
						{ internalType: 'address[]', name: 'positions', type: 'address[]' },
						{ internalType: 'uint256[]', name: 'tags', type: 'uint256[]' }
					],
					internalType: 'struct SportPositionalMarket.SportPositionalMarketParameters',
					name: '_parameters',
					type: 'tuple'
				}
			],
			name: 'initialize',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'initialized',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'invalidOdds',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
			name: 'mint',
			outputs: [],
			stateMutability: 'nonpayable',
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
			inputs: [],
			name: 'options',
			outputs: [
				{ internalType: 'contract SportPosition', name: 'home', type: 'address' },
				{ internalType: 'contract SportPosition', name: 'away', type: 'address' },
				{ internalType: 'contract SportPosition', name: 'draw', type: 'address' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'optionsCount',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
			name: 'paused',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'phase',
			outputs: [{ internalType: 'enum ISportPositionalMarket.Phase', name: '', type: 'uint8' }],
			stateMutability: 'view',
			type: 'function'
		},
		{ inputs: [], name: 'requireUnpaused', outputs: [], stateMutability: 'view', type: 'function' },
		{
			inputs: [{ internalType: 'uint256', name: '_outcome', type: 'uint256' }],
			name: 'resolve',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'resolved',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [
				{ internalType: 'uint256', name: '_homeOdds', type: 'uint256' },
				{ internalType: 'uint256', name: '_awayOdds', type: 'uint256' },
				{ internalType: 'uint256', name: '_drawOdds', type: 'uint256' }
			],
			name: 'restoreInvalidOdds',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'result',
			outputs: [{ internalType: 'enum ISportPositionalMarket.Side', name: '', type: 'uint8' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'sUSD',
			outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
			stateMutability: 'view',
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
			inputs: [{ internalType: 'address', name: '_theRundownConsumer', type: 'address' }],
			name: 'setTherundownConsumer',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
			name: 'setsUSD',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'sportsAMM',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			name: 'tags',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'theRundownConsumer',
			outputs: [{ internalType: 'contract ITherundownConsumer', name: '', type: 'address' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'times',
			outputs: [
				{ internalType: 'uint256', name: 'maturity', type: 'uint256' },
				{ internalType: 'uint256', name: 'expiry', type: 'uint256' }
			],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'totalSupplies',
			outputs: [
				{ internalType: 'uint256', name: 'home', type: 'uint256' },
				{ internalType: 'uint256', name: 'away', type: 'uint256' },
				{ internalType: 'uint256', name: 'draw', type: 'uint256' }
			],
			stateMutability: 'view',
			type: 'function'
		}
	]
}

export default sportsMarketContract
