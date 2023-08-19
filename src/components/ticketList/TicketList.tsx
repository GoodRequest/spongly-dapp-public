import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { map, slice } from 'lodash'
import { useTranslation } from 'next-export-i18n'

// components
import { ITicketContent } from '@/content/ticketsContent/TicketsContent'
import TicketListItem from '@/components/ticketList/TicketListItem'
import Sorter from '@/components/Sorter'

// assets
import ArrowIcon from '@/assets/icons/arrow-down.svg'

// utils
import { TICKET_SORTING, TICKET_TYPE } from '@/utils/constants'
import { getTicketsTypeName } from '@/utils/helpers'

// styles
import * as SC from './TicketListStyles'
import * as SCS from '@/styles/GlobalStyles'

interface ITicketList {
	type: string
	list: ITicketContent[]
	loading: boolean
	activeKeysList: any[]
	setActiveKeysList: Dispatch<SetStateAction<string[]>>
}

const LIST_SIZE = 10

const TicketList: FC<ITicketList> = ({ type = TICKET_TYPE.OPEN_TICKET, list = [], loading, activeKeysList, setActiveKeysList }) => {
	const [renderList, setRenderList] = useState<ITicketContent[]>(slice(list, 0, LIST_SIZE))
	const [hasMore, setHasMore] = useState(list.length > LIST_SIZE)
	const { t } = useTranslation()

	useEffect(() => {
		setRenderList(slice(list, 0, renderList.length > LIST_SIZE ? renderList.length : LIST_SIZE))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [list])

	useEffect(() => {
		setHasMore(renderList.length < list.length)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderList])

	const addTicketsToList = () => {
		if (hasMore) {
			if (renderList.length < list.length && renderList.length + LIST_SIZE < list.length) {
				setRenderList([...renderList, ...slice(list, renderList.length, renderList.length + LIST_SIZE)])
			}
			if (renderList.length < list.length && renderList.length + LIST_SIZE >= list.length) {
				setRenderList([...list])
			}
		}
	}

	return (
		<SC.TicketListWrapper>
			<SC.PCRow gutter={0} style={{ marginBottom: '32px' }}>
				<Col span={20}>
					<h1>{getTicketsTypeName(type, t)}</h1>
				</Col>
			</SC.PCRow>

			<Row>
				<Col span={24}>
					{loading ? (
						<>
							<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
							<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
							<SC.RowSkeleton active loading paragraph={{ rows: 1 }} />
						</>
					) : (
						<>
							<SCS.SorterRow>
								<Col md={5} span={0}>
									<Sorter title={t('Wallet')} />
								</Col>
								<Col md={7} span={6}>
									<Sorter title={t('Success rate')} name={TICKET_SORTING.SUCCESS_RATE} />
								</Col>
								<Col md={3} span={6}>
									<Sorter title={t('Buy-in')} name={TICKET_SORTING.BUY_IN} />
								</Col>
								<Col md={3} span={6}>
									<Sorter title={t('Quote')} name={TICKET_SORTING.TOTAL_TICKET_QUOTE} />
								</Col>
								<Col md={6} span={6}>
									<Sorter title={t('Matches')} name={TICKET_SORTING.MATCHES} />
								</Col>
							</SCS.SorterRow>
							{renderList.length > 0 ? (
								map(renderList, (item: ITicketContent, index: any) => (
									<TicketListItem
										type={type}
										ticket={item.ticket}
										key={index}
										index={index}
										activeKeysList={activeKeysList}
										setActiveKeysList={setActiveKeysList}
									/>
								))
							) : (
								<SC.TicketItemEmptyState>
									<Row>
										<Col span={5}>
											<SC.EmptyImage />
										</Col>
										<Col span={19}>
											<h4>{t('There are currently no {{ticketsType}}', { ticketsType: getTicketsTypeName(type, t)?.toLowerCase() })}</h4>
											<p>{t('You can try other type')}</p>
										</Col>
									</Row>
								</SC.TicketItemEmptyState>
							)}
							{hasMore && (
								<SC.LoadMore onClick={addTicketsToList}>
									<SCS.Icon icon={ArrowIcon} />
									<span>{t('Show more')}</span>
								</SC.LoadMore>
							)}
						</>
					)}
				</Col>
			</Row>
		</SC.TicketListWrapper>
	)
}

export default TicketList
