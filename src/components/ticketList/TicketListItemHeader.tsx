import { FC } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { Spin, Col } from 'antd'
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
	const { account, ticketType, closedTicketType, buyIn, matchesCount, totalTicketQuote } = ticket
	return (
		<SC.TicketItemRow>
			<Col md={{ order: 0, span: 2 }} xs={{ span: 8, order: 1 }}>
				<TicketIcon imageSrc={getWalletImage(account)} />
			</Col>
			<Col md={{ span: 3, order: 1 }} xs={{ span: 8, order: 2 }}>
				<SC.ColContent>{formatAccount(account)}</SC.ColContent>
				<SC.ColHeader>{t('Wallet')}</SC.ColHeader>
			</Col>
			<Col md={{ span: 4, order: 2 }} xs={{ span: 8, order: 3 }}>
				{isLoading ? (
					<SC.ColContent>
						<Spin indicator={<LoadingOutlined spin />} />
					</SC.ColContent>
				) : (
					<SC.ColContent>{ticket.successRate}%</SC.ColContent>
				)}
				<SC.ColHeader>{t('Success rate')}</SC.ColHeader>
			</Col>
			<Col md={{ span: 4, order: 3 }} xs={{ span: 24, order: ticketType === TICKET_TYPE.OPEN_TICKET ? 3 : 0 }}>
				{ticketType === TICKET_TYPE.OPEN_TICKET ? (
					<SC.Separator />
				) : (
					<SC.TicketType ticketType={closedTicketType || ticketType}>{getTicketTypeName(closedTicketType || ticketType, t)}</SC.TicketType>
				)}
			</Col>
			<Col md={{ span: 3, order: 4 }} xs={{ span: 8, order: 4 }}>
				<SC.ColContent>{`${round(buyIn, 2).toFixed(2)} $`}</SC.ColContent>
				<SC.ColHeader>{t('Buy-In')}</SC.ColHeader>
			</Col>
			<Col md={{ span: 3, order: 4 }} xs={{ span: 8, order: 5 }}>
				<SC.ColContent>{round(totalTicketQuote, 2).toFixed(2)}</SC.ColContent>
				<SC.ColHeader>{t('Quote')}</SC.ColHeader>
			</Col>
			<Col md={{ span: 3, order: 4 }} xs={{ span: 8, order: 6 }}>
				<SC.ColContent>{matchesCount}</SC.ColContent>
				<SC.ColHeader>{t('Matches')}</SC.ColHeader>
			</Col>
		</SC.TicketItemRow>
	)
}

export default TicketListItemHeader
