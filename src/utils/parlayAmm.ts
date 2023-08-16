import { ethers, BigNumber } from 'ethers'
import { PositionNumber /* , STABLE_COIN  */ } from './constants'
import { NetworkId } from './networkConnector'
import { StablecoinKey /* , getCollateralAddress */ } from './collaterals'
// import { isMultiCollateralSupportedForNetwork } from './network'

export const getParlayMarketsAMMQuoteMethod: any = (
	stableCoin: StablecoinKey,
	networkId: NetworkId,
	parlayMarketsAMMContract: ethers.Contract,
	marketsAddresses: string[],
	selectedPositions: PositionNumber[],
	sUSDPaid: BigNumber
) => {
	// TODO: implement different currency support
	// const isNonSusdCollateral = stableCoin !== STABLE_COIN.S_USD
	// const collateralAddress = getCollateralAddress(isNonSusdCollateral as any, networkId)
	// const isMultiCollateralSupported = isMultiCollateralSupportedForNetwork(networkId)

	// if (isMultiCollateralSupported && isNonSusdCollateral && collateralAddress) {
	// 	return parlayMarketsAMMContract.buyQuoteFromParlayWithDifferentCollateral(marketsAddresses, selectedPositions, sUSDPaid, collateralAddress)
	// }
	return parlayMarketsAMMContract.buyQuoteFromParlay(marketsAddresses, selectedPositions, sUSDPaid)
}
