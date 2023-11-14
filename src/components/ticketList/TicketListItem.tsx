import { Dispatch, FC, SetStateAction, useState } from 'react'
import { map } from 'lodash'
import { Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'

// components
import TicketListItemHeader from '@/components/ticketList/TicketListItemHeader'
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import Button from '@/atoms/button/Button'
import TicketItem from '@/components/ticketList/TicketItem'
import CopyTicketButton from '../copyTicketButton/CopyTicketButton'

// utils
import { PAGES } from '@/utils/enums'
import { TICKET_TYPE } from '@/utils/constants'
import { orderPositionsAsSportMarkets, getPositionsWithMergedCombinedPositions } from '@/utils/helpers'

// types
import { SGPItem } from '@/typescript/types'

// styles
import * as SC from './TicketListStyles'

interface ITicketListItem extends ITicketContent {
	type: string
	loading?: boolean
	index: string | number
	activeKeysList: any[]
	setActiveKeysList: Dispatch<SetStateAction<string[]>>
	sgpFees?: SGPItem[]
}

const TicketListItem: FC<ITicketListItem> = ({ index, ticket, loading, type, activeKeysList, setActiveKeysList, sgpFees }) => {
	const { t } = useTranslation()
	const router = useRouter()

	const [isExpanded, setIsExpanded] = useState(false)
	const orderedPositions = orderPositionsAsSportMarkets(ticket)
	const positionsWithMergedCombinedPositions = getPositionsWithMergedCombinedPositions(orderedPositions, ticket, sgpFees)

	const handleCollapseChange = (e: any) => {
		setActiveKeysList([...e])
		setIsExpanded((c) => !c)
	}

	return (
		<SC.TicketCollapse
			collapsible={'icon'}
			expandIconPosition={'end'}
			onChange={(e) => handleCollapseChange(e)}
			isExpanded={isExpanded}
			activeKey={activeKeysList}
		>
			<SC.CollapsePanel isExpanded={isExpanded} header={<TicketListItemHeader ticket={ticket} />} key={`${ticket.account}-${index}`}>
				{!loading && isExpanded && (
					<SC.PanelContent>
						<SC.StylesRow gutter={[16, 16]}>
							{map(positionsWithMergedCombinedPositions, (item, index) => (
								<Col key={item.id} span={24} lg={12}>
									<TicketItem
										match={item}
										oddsInfo={{
											quote: item?.isCombined ? item?.odds : Number(ticket?.marketQuotes?.[index]),
											isParlay: orderedPositions.length > 1,
											isCombined: item?.isCombined,
											combinedPositionsText: item?.combinedPositionsText
										}}
									/>
								</Col>
							))}
						</SC.StylesRow>
						<SC.StylesRow gutter={[16, 16]}>
							<Col md={type === TICKET_TYPE.CLOSED_TICKET ? 24 : 12} span={24}>
								<Button
									btnStyle={'secondary'}
									content={t('Open detail')}
									onClick={() => router.push(`/${PAGES.TICKET_DETAIL}/?ticketId=${ticket.id}`)}
								/>
							</Col>
							{(type === TICKET_TYPE.ONGOING_TICKET || type === TICKET_TYPE.OPEN_TICKET || type === TICKET_TYPE.HOT_TICKET) && (
								<Col md={12} span={24}>
									<CopyTicketButton ticket={ticket} />
								</Col>
							)}
						</SC.StylesRow>
					</SC.PanelContent>
				)}
			</SC.CollapsePanel>
		</SC.TicketCollapse>
	)
}

export default TicketListItem
