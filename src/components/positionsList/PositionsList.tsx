import React from 'react'
import { PositionWithCombinedAttrs } from '@/typescript/types'

import * as SC from './PositionsListStyles'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
}

const PositionsList = ({ positionsWithCombinedAttrs }: Props) => {
	// console.log(positionsWithCombinedAttrs)

	return <SC.PositionsListWrapper>CONTENT</SC.PositionsListWrapper>
}

export default PositionsList
