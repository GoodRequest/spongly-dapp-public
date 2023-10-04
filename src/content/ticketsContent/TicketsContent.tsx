import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'
import { filter as lodashFilter, find, includes, orderBy, toString } from 'lodash'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'
import { useMedia } from '@/hooks/useMedia'

// types
import { ITicket, Option } from '@/typescript/types'
import { RootState } from '@/redux/rootReducer'

// atoms
import Select from '@/atoms/select/Select'

// components
import TicketsRadioButtonsForm from '@/components/ticketsRadioButtonsForm/TicketsRadioButtonsForm'
import TicketList from '@/components/ticketList/TicketList'

// styles
import * as SC from './TicketsContentStyles'

// assets
import FilterIcon from '@/assets/icons/filter-icon.svg'

// utils
import { ORDER_DIRECTION, STATIC, SportFilterEnum, TICKET_SORTING, TICKET_TYPE } from '@/utils/constants'
import { RESOLUTIONS } from '@/utils/enums'
import { SPORTS_TAGS_MAP, TAGS_LIST } from '@/utils/tags'
import { decodeSorter, isBellowOrEqualResolution } from '@/utils/helpers'
import { breakpoints } from '@/styles/theme'
import SportFilter from '@/components/sportFilter/SportFilter'

export interface ITicketContent {
	ticket: ITicket
}

interface ITicketFilter {
	status: TICKET_TYPE | undefined
	league: string | string[]
	sport: string | string[]
}

export const DEFAULT_TICKET_TYPE = TICKET_TYPE.OPEN_TICKET

const TicketsContent = () => {
	const { t } = useTranslation()
	const router = useRouter()
	const isMounted = useIsMounted()

	const size = useMedia()

	const { data, isLoading, isFailure } = useSelector((state: RootState) => state.tickets.ticketList)

	const [loading, setLoading] = useState(false)
	const [isFilterOpened, setFilterOpened] = useState(false)
	const [selectedSport, setSelectedSport] = useState(TAGS_LIST)
	const [activeKeysList, setActiveKeysList] = useState<string[]>([])

	const [filter, setFilter] = useState<ITicketFilter>({
		status: DEFAULT_TICKET_TYPE,
		league: STATIC.ALL,
		sport: STATIC.ALL
	})

	const contentRef = useRef<HTMLDivElement>(null)

	const ticketsOptions: Option[] = [
		{
			label: t('Open Tickets'),
			value: TICKET_TYPE.OPEN_TICKET
		},
		{
			label: t('Ongoing Tickets'),
			value: TICKET_TYPE.ONGOING_TICKET
		},
		{
			label: t('Closed Tickets'),
			value: TICKET_TYPE.CLOSED_TICKET
		}
	]

	const filterTickets = (filter: ITicketFilter) => {
		if (!data) return []
		if (!includes([STATIC.ALL, undefined], filter.sport) || !includes([STATIC.ALL, undefined], filter.league)) {
			return orderBy(
				data.filter(
					(item) =>
						item.ticket.ticketType === filter.status &&
						item.ticket.positions.some((position) => includes([...selectedSport.map((sport) => sport.id.toString())], position.market.tags?.at(0)))
				),
				[`ticket.${TICKET_SORTING.SUCCESS_RATE}`],
				[ORDER_DIRECTION.DESCENDENT]
			)
		}

		return orderBy(
			data.filter((item) => item.ticket.ticketType === filter.status),
			[`ticket.${TICKET_SORTING.SUCCESS_RATE}`],
			[ORDER_DIRECTION.DESCENDENT]
		)
	}

	const [filteredTickets, setFilteredTickets] = useState<ITicketContent[]>(filterTickets(filter))
	const [resultsCount, setResultsCount] = useState<number>(filteredTickets.length)
	const handleSubmit = (value?: TICKET_TYPE) => {
		setFilter((currentFilter: any) => ({ ...currentFilter, status: value }))
	}

	// Set filter from url
	useEffect(() => {
		setFilter({
			status: (router.query.status as TICKET_TYPE) || DEFAULT_TICKET_TYPE,
			sport: router.query.sport || STATIC.ALL,
			league: router.query.league || STATIC.ALL
		})

		if ((router.query.sport && router.query.sport !== STATIC.ALL) || (router.query.league && router.query.league !== STATIC.ALL)) {
			setFilterOpened(true)
		}
	}, [router.query.sport, router.query.league, router.query.status])

	useEffect(() => {
		if (includes([STATIC.ALL, undefined], filter.sport) && includes([STATIC.ALL, undefined], filter.league)) {
			setSelectedSport(TAGS_LIST)
		}
		if (!includes([STATIC.ALL, undefined], filter.sport) && includes([STATIC.ALL, undefined], filter.league)) {
			const sportName = filter.sport === SportFilterEnum.MMA ? 'MMA' : (filter.sport as SportFilterEnum)
			setSelectedSport(lodashFilter(TAGS_LIST, (item) => includes(SPORTS_TAGS_MAP[sportName], item.id)))
		}
		if (!includes([STATIC.ALL, undefined], filter.league)) {
			setSelectedSport([find(TAGS_LIST, (item) => toString(item.id) === filter.league) as any])
		}
	}, [filter.sport, filter.league])

	useEffect(() => {
		if (isLoading) {
			setLoading(true)
		} else {
			// NOTE: give some time to parse through data
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
	}, [isLoading])

	useEffect(() => {
		if (router.isReady) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						status: filter.status
					}
				},
				undefined,
				{ shallow: true }
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter.status, router.isReady])

	useEffect(() => {
		setResultsCount(filterTickets(filter).length)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSport])

	useEffect(() => {
		setResultsCount(filterTickets(filter).length)
		setFilteredTickets(filterTickets({ league: STATIC.ALL, sport: STATIC.ALL, status: filter.status }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter.status, data])

	useEffect(() => {
		const { direction, property } = decodeSorter()
		if (direction && property) {
			const ordered = orderBy(filteredTickets, [`ticket.${property}`], [direction])
			setFilteredTickets(ordered)
		} else {
			setFilteredTickets(filterTickets(filter))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.sorter])

	const onShowResults = () => {
		setFilteredTickets(filterTickets(filter))
		setActiveKeysList([])
		if (isBellowOrEqualResolution(size, RESOLUTIONS.MD)) {
			setFilterOpened(false)
		}
		if (contentRef.current) {
			contentRef.current?.scrollIntoView()
		}
	}

	const getFilterCount = useMemo(() => {
		let filterCount = 0
		if (!includes([STATIC.ALL, undefined], filter.sport)) {
			filterCount += 1
		}
		if (!includes([STATIC.ALL, undefined], filter.league)) {
			filterCount += 1
		}

		return { showCount: !!filterCount, filterCount }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSport])

	const bodyStyle = `
		<style>
			body {
	            @media (max-width: ${breakpoints.md}px) {
	            	overflow: hidden;
				}
	         }
		</style>
	`

	return isMounted ? (
		<>
			<SC.ListHeader>
				<SC.MobileWrapper>
					<SC.MobileSelectionHeader>
						<SC.ContentTitle>{t('Tickets')}</SC.ContentTitle>
						<SC.FilterBtn
							onClick={() => {
								setFilterOpened(!isFilterOpened)
							}}
						>
							<SC.FilterIcon src={FilterIcon} />
							{getFilterCount.showCount && <SC.FilterCount>{getFilterCount.filterCount}</SC.FilterCount>}
						</SC.FilterBtn>
					</SC.MobileSelectionHeader>

					<Select options={ticketsOptions} onChange={handleSubmit} value={filter.status} />
				</SC.MobileWrapper>
				<SC.PCWrapper>
					<TicketsRadioButtonsForm
						value={filter.status}
						onFormSubmit={(selectedValue) => {
							handleSubmit(selectedValue.ticketOptions)
						}}
					/>
					<SC.FilterBtn
						onClick={() => {
							setFilterOpened(!isFilterOpened)
						}}
						style={{ marginLeft: '8px' }}
					>
						<SC.FilterIcon src={FilterIcon} />
						{getFilterCount.showCount && <SC.FilterCount>{getFilterCount.filterCount}</SC.FilterCount>}
					</SC.FilterBtn>
				</SC.PCWrapper>
			</SC.ListHeader>
			{isFilterOpened && (
				<>
					<div dangerouslySetInnerHTML={{ __html: bodyStyle }} />
					<SportFilter
						resultsCount={resultsCount}
						onReset={() => {
							setFilter((currentFilter: any) => ({ ...currentFilter, league: STATIC.ALL, sport: STATIC.ALL }))
						}}
						onShowResults={onShowResults}
						onCloseMobileFilter={() => {
							setFilterOpened(false)
						}}
					/>
				</>
			)}
			<div ref={contentRef}>
				<TicketList
					type={filter.status || DEFAULT_TICKET_TYPE}
					list={filteredTickets}
					loading={loading}
					failure={isFailure}
					activeKeysList={activeKeysList}
					setActiveKeysList={setActiveKeysList}
				/>
			</div>
		</>
	) : null
}

export default TicketsContent
