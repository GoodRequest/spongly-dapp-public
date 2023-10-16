import { useTranslation } from 'next-export-i18n'
import React from 'react'
import { Row } from 'antd'
import { toNumber } from 'lodash'
import { PositionWithCombinedAttrs } from '@/typescript/types'
import { convertPositionNameToPosition, getSymbolText } from '@/utils/markets'

import * as SC from './PositionsListStyles'
import { getTeamImageSource } from '@/utils/images'
import { NO_TEAM_IMAGE_FALLBACK } from '@/utils/constants'
import Button from '@/atoms/button/Button'

type Props = {
	position: PositionWithCombinedAttrs
	quote: string | number
}

const PositionListItem = ({ position, quote }: Props) => {
	const { t } = useTranslation()

	const betOption = position?.isCombined ? position?.combinedPositionsText : getSymbolText(convertPositionNameToPosition(position?.side), position.market)

	return (
		<SC.PositionListItem>
			<SC.ColCenteredVertically span={12}>
				<Row style={{ width: '100%' }}>
					<SC.TeamCol span={6}>
						<SC.Img
							src={
								getTeamImageSource(position.market?.homeTeam || '', toNumber(position.market?.tags?.[0]))
									? getTeamImageSource(position.market?.homeTeam || '', toNumber(position.market?.tags?.[0]))
									: NO_TEAM_IMAGE_FALLBACK
							}
							alt={position.market?.homeTeam}
						/>
						<SC.MediumSpan> {position.market?.homeTeam}</SC.MediumSpan>
					</SC.TeamCol>
					<SC.TeamCol span={6}>
						<SC.VSSpan>VS</SC.VSSpan>
					</SC.TeamCol>
					<SC.TeamCol span={6}>
						<SC.Img
							src={
								getTeamImageSource(position.market?.awayTeam || '', toNumber(position.market?.tags?.[0]))
									? getTeamImageSource(position.market?.awayTeam || '', toNumber(position.market?.tags?.[0]))
									: NO_TEAM_IMAGE_FALLBACK
							}
							alt={position.market?.awayTeam}
						/>
						<SC.MediumSpan> {position.market?.awayTeam}</SC.MediumSpan>
					</SC.TeamCol>
				</Row>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				<SC.Position>
					<SC.MediumSpan>{t('Position')}</SC.MediumSpan>
					<SC.OddsWrapper>
						<SC.MediumSpan>{betOption}</SC.MediumSpan>
						<SC.MediumSpanGrey>{quote}</SC.MediumSpanGrey>
					</SC.OddsWrapper>
				</SC.Position>
			</SC.ColCenteredVertically>
			<SC.ColCenteredVertically span={6}>
				<Button
					btnStyle={'primary'}
					style={{ marginLeft: '16px', marginRight: '16px' }}
					onClick={() => console.log('TO DO')}
					// disabled={!(isMyWallet && isOpen && isntPlayedNow)}
					size={'large'}
					content={<SC.MediumSpan>{t('Copy Position')}</SC.MediumSpan>}
				/>
			</SC.ColCenteredVertically>
		</SC.PositionListItem>
	)
}

export default PositionListItem
