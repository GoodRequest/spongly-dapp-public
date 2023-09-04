import { round } from 'lodash'
import numbro from 'numbro'
import { OPTIMISM_DIVISOR } from '../constants'

export const roundPrice = (price: number | undefined | null, includeDollarSign?: boolean) => {
	if (!price) {
		return 0
	}
	// TODO: OPTIMISM_DIVISOR is only for Optimism add helper getStablecoinDecimals() task: CH-315
	const roundedPrice = round(price / OPTIMISM_DIVISOR, 2).toFixed(2)
	if (!includeDollarSign) return roundedPrice
	return `${roundedPrice} $`
}

export const formatCurrency = (value: string | number, decimals: number, trimDecimals = false) => {
	if (!value || !Number(value)) {
		return 0
	}

	return numbro(value).format({
		thousandSeparated: true,
		trimMantissa: trimDecimals,
		mantissa: decimals
	})
}
