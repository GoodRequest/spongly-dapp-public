import React, { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { SGPItem, UserTicket } from '@/typescript/types'
import { Network } from '@/utils/constants'

import * as SC from './PositionsListStyles'
import { getPositionsWithMergedCombinedPositions, orderPositionsAsSportMarkets } from '@/utils/helpers'
import useSGPFeesQuery from '@/hooks/useSGPFeesQuery'

type Props = {
	positionsData: UserTicket
}

const PositionsList = ({ positionsData }: Props) => {
	const { chain } = useNetwork()

	const [sgpFees, setSgpFees] = useState<SGPItem[]>()

	const sgpFeesRaw = useSGPFeesQuery(chain?.id as Network, {
		enabled: true
	})

	useEffect(() => {
		if (sgpFeesRaw.isSuccess && sgpFeesRaw.data) {
			setSgpFees(sgpFeesRaw.data)
		}
	}, [sgpFeesRaw.data, sgpFeesRaw.isSuccess])

	const orderedPositions = orderPositionsAsSportMarkets(positionsData)

	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, positionsData, sgpFees)

	console.log(positionsWithMergedCombinedPositions.length)

	return <SC.PositionsListWrapper>CONTENT</SC.PositionsListWrapper>
}

export default PositionsList
