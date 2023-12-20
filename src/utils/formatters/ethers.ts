import { BigNumberish, ethers } from 'ethers'
import { COLLATERAL_DECIMALS } from '@/utils/constants'

export const bigNumberFormatter = (value: BigNumberish, decimals?: number) =>
	Number(ethers.utils.formatUnits(value, decimals !== undefined ? decimals : COLLATERAL_DECIMALS.sUSD))
