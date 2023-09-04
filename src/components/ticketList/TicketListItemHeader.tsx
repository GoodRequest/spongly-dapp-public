import { FC } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { round } from 'lodash'
import { RootState } from '@/redux/rootReducer'

// utils
import { getTicketTypeName } from '@/utils/helpers'
import { TICKET_TYPE } from '@/utils/constants'
import { getWalletImage } from '@/utils/images'
import { formatAccount } from '@/utils/formatters/string'

// components
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'

// styles
import * as SC from '@/components/ticketList/TicketListStyles'
import { TicketIcon } from '@/components/ticketList/TicketListStyles'

const TicketListItemHeader: FC<ITicketContent> = ({ ticket }) => {
	const { t } = useTranslation()
	const { isLoading } = useSelector((state: RootState) => state.tickets.ticketList)
	const { account, positions, ticketType, closedTicketType, buyIn, position, totalTicketQuote } = ticket

	return (
		<SC.TicketItemRow>
			{/* // Row 1 */}
			<SC.TicketItemCol $customOrder={ticketType === TICKET_TYPE.OPEN_TICKET ? 1 : 2} md={2} span={8}>
				<TicketIcon imageSrc={getWalletImage(account)} />
			</SC.TicketItemCol>
			<SC.TicketItemCol $customOrder={ticketType === TICKET_TYPE.OPEN_TICKET ? 1 : 2} md={ticketType === TICKET_TYPE.OPEN_TICKET ? 4 : 3} span={8}>
				<SC.ColHeader>{t('Wallet')}</SC.ColHeader>
				<SC.ColContent>{formatAccount(account)}</SC.ColContent>
			</SC.TicketItemCol>
			<SC.TicketItemCol $customOrder={ticketType === TICKET_TYPE.OPEN_TICKET ? 1 : 2} md={ticketType === TICKET_TYPE.OPEN_TICKET ? 5 : 4} span={8}>
				<SC.ColHeader>{t('Success rate')}</SC.ColHeader>
				{isLoading ? (
					<SC.ColContent>
						<Spin indicator={<LoadingOutlined spin />} />
					</SC.ColContent>
				) : (
					<SC.ColContent>{ticket.successRate}%</SC.ColContent>
				)}
			</SC.TicketItemCol>
			{(closedTicketType || ticketType) &&
				(ticketType === TICKET_TYPE.OPEN_TICKET ? (
					<SC.TicketItemCol $customOrder={2} md={2} span={24}>
						<SC.Separator />
					</SC.TicketItemCol>
				) : (
					<SC.TicketItemCol $customOrder={1} overflow={'auto'} md={4} span={24} $paddingRight={30}>
						<SC.TicketType ticketType={closedTicketType || ticketType}>{getTicketTypeName(closedTicketType || ticketType, t)}</SC.TicketType>
					</SC.TicketItemCol>
				))}
			{/* Row 2 */}
			<SC.TicketItemCol $customOrder={3} md={3} span={8}>
				<SC.ColHeader>{t('Buy-In')}</SC.ColHeader>
				<SC.ColContent>{`${round(buyIn, 2).toFixed(2)} $`}</SC.ColContent>
			</SC.TicketItemCol>
			<SC.TicketItemCol $customOrder={3} md={3} span={8}>
				<SC.ColHeader>{t('Quote')}</SC.ColHeader>
				<SC.ColContent>{round(totalTicketQuote, 2).toFixed(2)}</SC.ColContent>
			</SC.TicketItemCol>
			<SC.TicketItemCol $customOrder={3} md={3} span={8}>
				<SC.ColHeader>{t('Matches')}</SC.ColHeader>
				<SC.ColContent>{position ? 1 : positions.length}</SC.ColContent>
			</SC.TicketItemCol>
		</SC.TicketItemRow>
	)
}

export default TicketListItemHeader
