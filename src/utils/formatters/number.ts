import numbro from 'numbro'
import { DEFAULT_CURRENCY_DECIMALS } from '../constants'

export const formatPercentage = (value: string | number, decimals = 2) => {
	let percentageValue = value
	if (!value || !Number(value)) {
		percentageValue = 0
	}

	return numbro(percentageValue).format({
		output: 'percent',
		mantissa: decimals
	})
}

export const floorNumberToDecimals = (value: number, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	return Math.floor(value * 10 ** decimals) / 10 ** decimals
}

export const roundNumberToDecimals = (value: number, decimals = 2) => {
	return +`${Math.round(Number(`${value}e+${decimals}`))}e-${decimals}`
}

export const roundToTwoDecimals = (number: number) => {
	return parseFloat((number / 100).toString())
}
