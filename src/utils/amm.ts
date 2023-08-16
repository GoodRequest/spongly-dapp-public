import { BigNumber, ethers } from 'ethers'
import { NetworkId } from './networkConnector'
import { StablecoinKey /* , getCollateralAddress */ } from './collaterals'
// import { isMultiCollateralSupportedForNetwork } from './network'

export const getSportsAMMQuoteMethod: any = (
	stableIndex: StablecoinKey,
	networkId: NetworkId,
	sportsAMMContract: ethers.Contract,
	marketAddress: string,
	selectedPosition: number,
	parsedAmount: BigNumber
) => {
	// TODO: different currencies
	// const collateralAddress = getCollateralAddress(true, networkId, stableIndex)
	// const isMultiCollateralSupported = isMultiCollateralSupportedForNetwork(networkId)

	// if (isMultiCollateralSupported && collateralAddress) {
	// 	console.log('multycolateral', { stableIndex, networkId, sportsAMMContract, marketAddress, selectedPosition, parsedAmount })
	// 	return sportsAMMContract.buyFromAmmQuoteWithDifferentCollateral(marketAddress, selectedPosition, parsedAmount, collateralAddress)
	// }
	return sportsAMMContract.buyFromAmmQuote(marketAddress, selectedPosition, parsedAmount)
}
