import { BigNumberish, ethers } from 'ethers'
import { STABLE_DECIMALS } from '@/utils/constants'

export const bigNumberFormatter = (value: BigNumberish, decimals?: number) =>
	Number(ethers.utils.formatUnits(value, decimals !== undefined ? decimals : STABLE_DECIMALS.sUSD))
