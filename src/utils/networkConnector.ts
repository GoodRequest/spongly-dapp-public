/* eslint-disable */
import { ethers, Signer } from 'ethers'
import sUSDContract from './contracts/sUSDContract'
import multipleCollateralContract from './contracts/multiCollateralContract'
import { Coins, NETWORK_IDS } from './constants'
import sportPositionalMarketDataContract from './contracts/sportPositionalMarketDataContract'
import sportMarketManagerContract from './contracts/sportMarketManagerContract'
import parlayMarketDataContract from './contracts/parlayMarketDataContract'
import parlayMarketsAMMContract from './contracts/parleyMarketsAMMContract'
import sportsAMMContract from '@/utils/contracts/sportsAMMContract'
import copyableParlayAMM from '@/utils/contracts/copyableParlayAMM'
import multiCollateralOnOffRampContract from '@/utils/contracts/multiCollateralOnOffRampContract'
import priceFeedContract from '@/utils/contracts/priceFeedContract'

export type NetworkId = typeof NETWORK_IDS[keyof typeof NETWORK_IDS]

type NetworkConnector = {
	initialized: boolean
	provider: ethers.providers.Provider | undefined
	signer: Signer | undefined
	setNetworkSettings: (networkSettings: NetworkSettings) => void
	sUSDContract?: ethers.Contract
	sportPositionalMarketDataContract?: ethers.Contract
	sportMarketManagerContract?: ethers.Contract
	sportsAMMContract?: ethers.Contract
	multipleCollateral?: Record<Coins, ethers.Contract | undefined>;
	parlayMarketDataContract?: ethers.Contract
	parlayMarketsAMMContract?: ethers.Contract
	priceFeedContract?: ethers.Contract
	copyableParlayAMM?: ethers.Contract
	multiCollateralOnOffRampContract?: ethers.Contract
}

type NetworkSettings = {
	networkId?: NetworkId
	signer?: ethers.Signer
	provider?: ethers.providers.Provider
}

// @ts-ignore
const networkConnector: NetworkConnector = {
	initialized: false,
	setNetworkSettings(networkSettings: NetworkSettings) {
		this.initialized = true
		this.signer = networkSettings.signer
		this.provider = networkSettings.provider
		this.sUSDContract = initializeContract(sUSDContract, networkSettings)
		this.sportPositionalMarketDataContract = initializeContract(sportPositionalMarketDataContract, networkSettings)
		this.sportMarketManagerContract = initializeContract(sportMarketManagerContract, networkSettings)
		this.parlayMarketDataContract = initializeContract(parlayMarketDataContract, networkSettings)
		this.parlayMarketsAMMContract = initializeContract(parlayMarketsAMMContract, networkSettings)
		this.sportsAMMContract = initializeContract(sportsAMMContract, networkSettings)
		this.copyableParlayAMM = initializeContract(copyableParlayAMM, networkSettings)
		this.multiCollateralOnOffRampContract = initializeContract(multiCollateralOnOffRampContract, networkSettings)
		this.priceFeedContract = initializeContract(priceFeedContract, networkSettings);
		this.multipleCollateral = {
			sUSD: initializeContract(multipleCollateralContract.sUSD, networkSettings),
			DAI: initializeContract(multipleCollateralContract.DAI, networkSettings),
			USDC: initializeContract(multipleCollateralContract.USDC, networkSettings),
			USDCe: initializeContract(multipleCollateralContract.USDCe, networkSettings),
			USDT: initializeContract(multipleCollateralContract.USDT, networkSettings),
			OP: initializeContract(multipleCollateralContract.OP, networkSettings),
			WETH: initializeContract(multipleCollateralContract.WETH, networkSettings),
			ETH: initializeContract(multipleCollateralContract.ETH, networkSettings),
			ARB: initializeContract(multipleCollateralContract.ARB, networkSettings),
		};
	}
}

const initializeContract = (contract: any, networkSettings: NetworkSettings) => {
	const contractAddress = contract.addresses[networkSettings.networkId || NETWORK_IDS.OPTIMISM];
    return contractAddress !== ''
        ? new ethers.Contract(contractAddress, contract.abi, networkConnector.provider)
        : undefined;
	// if (networkSettings.networkId === NETWORK_IDS.ETHEREUM_MAINNET) {
	// 	return undefined
	// }
	// if (contract.addresses[networkSettings.networkId || NETWORK_IDS.OPTIMISM] !== '') {
	// 	return new ethers.Contract(contract.addresses[networkSettings.networkId || NETWORK_IDS.OPTIMISM], contract.abi, networkConnector.provider)
	// }
	// return undefined
}

export default networkConnector
