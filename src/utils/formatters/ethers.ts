import { BigNumberish, ethers } from 'ethers'

export const bigNumberFormatter = (value: BigNumberish) => Number(ethers.utils.formatEther(value))

export const bigNumberFormmaterWithDecimals = (value: string, decimals?: number) => Number(ethers.utils.formatUnits(value, decimals ?? 18))
