import { BigNumber, ethers } from 'ethers'

export const getSportsAMMQuoteMethod: any = (
	collateralAddress: string,
	isDefaultCollateral: boolean,
	sportsAMMContract: ethers.Contract,
	marketAddress: string,
	selectedPosition: number,
	parsedAmount: BigNumber
) => {
	return isDefaultCollateral
		? sportsAMMContract.buyFromAmmQuote(marketAddress, selectedPosition, parsedAmount)
		: sportsAMMContract.buyFromAmmQuoteWithDifferentCollateral(marketAddress, selectedPosition, parsedAmount, collateralAddress)
}
