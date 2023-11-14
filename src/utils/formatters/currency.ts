import { round } from 'lodash'
import numbro from 'numbro'
import { getDividerByNetworkId } from '@/utils/helpers'

export const roundPrice = (price: number | undefined | null, includeDollarSign: boolean, networkId: number) => {
	if (!price) {
		return 0
	}
	// TODO: dat 18 decimals ak je positional balances
	const roundedPrice = round(price / getDividerByNetworkId(networkId), 2).toFixed(2)
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
