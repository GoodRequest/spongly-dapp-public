import { FC, useRef, useState } from 'react'
import map from 'lodash/map'
import { useTranslation } from 'next-export-i18n'

import * as SC from '../../TicketBetContainerStyles'

import arrowRightIcon from '@/assets/icons/arrow-right.svg'
import addIcon from '@/assets/icons/add.svg'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import { MAX_TICKET_MATCHES, MAX_TICKETS } from '@/utils/constants'
import CloseMenuIcon from '@/assets/icons/close-icon-mobile.svg'
import { SCROLL_DIRECTION } from '@/utils/enums'

interface IHorizontalScroller {
	tickets: IUnsubmittedBetTicket[]
	removeTicket: (id: number) => void
	addTicket: () => void
	setActiveTicket: (ticket: IUnsubmittedBetTicket) => void
	activeTicket?: IUnsubmittedBetTicket
}

const HorizontalScroller: FC<IHorizontalScroller> = ({ tickets, addTicket, activeTicket, setActiveTicket, removeTicket }) => {
	const { t } = useTranslation()
	const ref: any = useRef()
	const [visibleArrows, setVisibleArrows] = useState<SCROLL_DIRECTION>()
	const handleTicketScroll = (direction: SCROLL_DIRECTION) => {
		if (direction === SCROLL_DIRECTION.RIGHT) {
			ref?.current?.scroll({ left: ref?.current?.scrollWidth, behavior: 'smooth' })
			setVisibleArrows(SCROLL_DIRECTION.LEFT)
		}
		if (direction === SCROLL_DIRECTION.LEFT) {
			ref?.current?.scroll({ left: 0, behavior: 'smooth' })
			setVisibleArrows(SCROLL_DIRECTION.RIGHT)
		}
	}

	const addTicketHandler = () => {
		setVisibleArrows(SCROLL_DIRECTION.RIGHT)
		addTicket()
	}

	return (
		<SC.TicketChipses ref={ref}>
			{tickets?.length < MAX_TICKETS && (
				<SC.TicketChips icon onClick={addTicketHandler}>
					<SC.ImgIcon src={addIcon} />
				</SC.TicketChips>
			)}
			{map(tickets, (item, key) => (
				<SC.TicketChips selected={activeTicket?.id === item.id} onClick={() => setActiveTicket(item)} key={key}>
					{activeTicket?.id === item.id
						? `${t('TICKET')} ${key + 1} (${activeTicket?.matches?.length || 0}/${MAX_TICKET_MATCHES})`
						: `${t('TICKET')} ${key + 1}`}
					{tickets.length > 1 && (
						<SC.CloseIcon
							onClick={(e) => {
								e.stopPropagation()
								removeTicket(item.id as number)
							}}
							src={CloseMenuIcon}
						/>
					)}
				</SC.TicketChips>
			))}

			{tickets.length > 3 && visibleArrows === SCROLL_DIRECTION.RIGHT && (
				<SC.GradientLoss direction={SCROLL_DIRECTION.RIGHT}>
					<SC.TicketChips direction={SCROLL_DIRECTION.RIGHT} icon onClick={() => handleTicketScroll(SCROLL_DIRECTION.RIGHT)}>
						<SC.ImgIcon src={arrowRightIcon} />
					</SC.TicketChips>
				</SC.GradientLoss>
			)}
			{tickets.length > 3 && visibleArrows === SCROLL_DIRECTION.LEFT && (
				<SC.GradientLoss direction={SCROLL_DIRECTION.LEFT}>
					<SC.TicketChips direction={SCROLL_DIRECTION.LEFT} icon onClick={() => handleTicketScroll(SCROLL_DIRECTION.LEFT)}>
						<SC.ImgIcon src={arrowRightIcon} />
					</SC.TicketChips>
				</SC.GradientLoss>
			)}
		</SC.TicketChipses>
	)
}

export default HorizontalScroller
