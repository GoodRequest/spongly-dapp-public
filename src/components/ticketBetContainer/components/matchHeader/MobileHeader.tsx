import React, { FC, useEffect } from 'react'
import { Col } from 'antd'
import { find, toNumber } from 'lodash'
import { useTranslation } from 'next-export-i18n'
import * as SC from './MobileHeaderStyles'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'
import Select from '@/atoms/select/Select'
import ArrowDownIcon from '@/assets/icons/asComponent/ArrowDownIcon'
import { MAX_TICKET_MATCHES } from '@/utils/constants'

interface IMobileHeader {
	tickets: IUnsubmittedBetTicket[]
	addTicket: any
	setActiveTicket: (ticket: IUnsubmittedBetTicket) => void
	activeTicket?: IUnsubmittedBetTicket
	setRolledUp: (val: (current: boolean) => boolean) => void
	rolledUp: boolean
}

const MobileHeader: FC<IMobileHeader> = ({ tickets = [], addTicket, setActiveTicket, activeTicket, setRolledUp, rolledUp }) => {
	const { t } = useTranslation()
	const [options, setOptions] = React.useState<{ value: any; label: string }[]>([])

	const selectOptions = () => {
		const ticketsToOptions = tickets?.map((ticket, index) => {
			return {
				value: index + 1,
				label: `${t('TICKET')} ${index + 1}`
			}
		})

		if (tickets.length < 5) {
			setOptions([
				...ticketsToOptions,
				{
					value: 99,
					label: t(`ADD TICKET`)
				}
			])
		} else {
			setOptions(ticketsToOptions)
		}
	}
	useEffect(() => {
		selectOptions()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tickets, activeTicket])

	const onChangeSelect = (value: number) => {
		if (toNumber(value) === 99) {
			addTicket()
		} else {
			setActiveTicket(find(tickets, ['id', toNumber(value)]) as any)
		}
	}

	return (
		<SC.MobileHeaderRow rolledUp={rolledUp} justify={'space-between'}>
			<Col xs={11} sm={9} md={8}>
				<Select
					options={options}
					placement={rolledUp ? 'bottomLeft' : 'topLeft'}
					popupClassName={'ticket-select'}
					useSelectContainer={false}
					onChange={(value: number) => onChangeSelect(value)}
					value={`${t('TICKET')} ${activeTicket?.id}`}
				/>
			</Col>
			<SC.ShiftedCol xs={6} sm={6} md={6}>
				<SC.HeaderLabel>{t('Matches')}</SC.HeaderLabel>
				<SC.HeaderValue>{`${activeTicket?.matches?.length || 0}/${MAX_TICKET_MATCHES}`}</SC.HeaderValue>
			</SC.ShiftedCol>
			<SC.ShiftedCol xs={4} sm={6} md={6}>
				<SC.HeaderLabel>{t('Quote')}</SC.HeaderLabel>
				<SC.HeaderValue>{activeTicket?.totalQuote || '0'}</SC.HeaderValue>
			</SC.ShiftedCol>
			<SC.DropButtonColWrapper xs={3} sm={2} md={2}>
				<SC.DropButton rolledUp={rolledUp} onClick={() => setRolledUp((current) => !current)}>
					<ArrowDownIcon />
				</SC.DropButton>
			</SC.DropButtonColWrapper>
		</SC.MobileHeaderRow>
	)
}

export default MobileHeader
