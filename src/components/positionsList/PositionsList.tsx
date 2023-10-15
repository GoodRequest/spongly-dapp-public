import React, { useState } from 'react'
import { toNumber } from 'lodash'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { PositionWithCombinedAttrs } from '@/typescript/types'

import * as SC from './PositionsListStyles'
import { getTeamImageSource } from '@/utils/images'
import { NO_TEAM_IMAGE_FALLBACK } from '@/utils/constants'
import { formatParlayQuote, formatPositionOdds } from '@/utils/formatters/quote'
import { convertPositionNameToPosition, getSymbolText } from '@/utils/markets'
import Button from '@/atoms/button/Button'

type Props = {
	positionsWithCombinedAttrs: PositionWithCombinedAttrs[]
	marketQuotes?: string[]
}

const PositionsList = ({ positionsWithCombinedAttrs, marketQuotes }: Props) => {
	const { t } = useTranslation()

	const isParlay = positionsWithCombinedAttrs?.length > 1

	const getBetOption = (item: PositionWithCombinedAttrs) => {
		if (item?.isCombined) return item?.combinedPositionsText

		return getSymbolText(convertPositionNameToPosition(item?.side), item.market)
	}

	const getOdds = (item: PositionWithCombinedAttrs, index: number) => {
		if (item?.isCombined) {
			return formatParlayQuote(item?.odds)
		}

		if (isParlay) {
			return formatParlayQuote(Number(marketQuotes?.[index]))
		}

		return formatPositionOdds(item)
	}
	// NOTE: showing historic odds -> there is no bonus.
	// const getBonus = (item: PositionWithCombinedAttrs) => {
	// 	return '1%'
	// }

	return (
		<SC.PositionsListWrapper>
			{positionsWithCombinedAttrs?.map((item, index) => {
				return (
					<SC.PositionListItem style={{ marginBottom: '16px' }}>
						<SC.ColCenteredVertically span={12}>
							<Row style={{ width: '100%' }}>
								<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<img
										style={{ height: '48px', width: '48px' }}
										src={
											getTeamImageSource(item.market?.homeTeam || '', toNumber(item.market?.tags?.[0]))
												? getTeamImageSource(item.market?.homeTeam || '', toNumber(item.market?.tags?.[0]))
												: NO_TEAM_IMAGE_FALLBACK
										}
										alt={item.market.homeTeam}
									/>
									<SC.MediumSpan> {item.market?.homeTeam}</SC.MediumSpan>
								</Col>
								<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<SC.VSSpan>VS</SC.VSSpan>
								</Col>
								<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<img
										style={{ height: '48px', width: '48px' }}
										src={
											getTeamImageSource(item.market?.awayTeam || '', toNumber(item.market?.tags?.[0]))
												? getTeamImageSource(item.market?.awayTeam || '', toNumber(item.market?.tags?.[0]))
												: NO_TEAM_IMAGE_FALLBACK
										}
										alt={item.market.awayTeam}
									/>
									<SC.MediumSpan> {item.market?.awayTeam}</SC.MediumSpan>
								</Col>
							</Row>
						</SC.ColCenteredVertically>
						<SC.ColCenteredVertically span={6}>
							<SC.Position>
								<SC.MediumSpan>{t('Position')}</SC.MediumSpan>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '12px' }}>
									<SC.MediumSpan>{getBetOption(item)}</SC.MediumSpan>
									<SC.MediumSpanGrey>{getOdds(item, index)}</SC.MediumSpanGrey>
									{/* <SC.MediumSpanGreen>{getBonus(item)}</SC.MediumSpanGreen> */}
								</div>
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
			})}
		</SC.PositionsListWrapper>
	)
}

export default PositionsList
