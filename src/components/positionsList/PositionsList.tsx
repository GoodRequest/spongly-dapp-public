import React from 'react'
import { PositionWithCombinedAttrs } from '@/typescript/types'

import * as SC from './PositionsListStyles'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
}

const PositionsList = ({ positionsWithCombinedAttrs }: Props) => {
	return (
		<SC.PositionsListWrapper>
			{positionsWithCombinedAttrs?.map((item) => {
				return (
					<SC.PositionListItem style={{ marginBottom: '16px' }}>
						<SC.ColCenteredVertically span={12}>
							{item.market?.homeTeam} VS
							{item.market?.awayTeam}
						</SC.ColCenteredVertically>
						<SC.ColCenteredVertically span={6}>Position.</SC.ColCenteredVertically>
						<SC.ColCenteredVertically span={6}>Copy position</SC.ColCenteredVertically>
					</SC.PositionListItem>
				)
			})}
		</SC.PositionsListWrapper>
	)
}

export default PositionsList
