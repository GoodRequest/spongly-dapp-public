import { BigNumberish, ethers } from 'ethers'

export const bigNumberFormatter = (value: BigNumberish, decimals?: number) => Number(ethers.utils.formatUnits(value, decimals !== undefined ? decimals : 18))

export const bigNumberFormmaterWithDecimals = (value: string, decimals?: number) => Number(ethers.utils.formatUnits(value, decimals ?? 18))
