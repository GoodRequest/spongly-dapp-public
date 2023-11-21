import { BigNumber, ethers } from 'ethers'
import { PositionNumber } from './constants'

export const getParlayMarketsAMMQuoteMethod: any = (
	collateralAddress: string,
	isDefaultCollateral: boolean,
	parlayMarketsAMMContract: ethers.Contract,
	marketsAddresses: string[],
	selectedPositions: PositionNumber[],
	sUSDPaid: BigNumber
) => {
	return isDefaultCollateral
		? parlayMarketsAMMContract.buyQuoteFromParlay(marketsAddresses, selectedPositions, sUSDPaid)
		: parlayMarketsAMMContract.buyQuoteFromParlayWithDifferentCollateral(marketsAddresses, selectedPositions, sUSDPaid, collateralAddress)
}
