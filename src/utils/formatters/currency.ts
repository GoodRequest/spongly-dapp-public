import { round } from 'lodash'
import numbro from 'numbro'
import { getDividerByNetworkId } from '@/utils/helpers'
import { OPTIMISM_DIVISOR } from '@/utils/constants'

export const roundPrice = (price: number | undefined | null, includeDollarSign: boolean, networkId?: number) => {
	if (!price) {
		return 0
	}
	// NOTE: if networkId is not provided use 18 decimals (for cases where we don't care about chain.id)
	const roundedPrice = round(price / (networkId ? getDividerByNetworkId(networkId) : OPTIMISM_DIVISOR), 2).toFixed(2)
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
