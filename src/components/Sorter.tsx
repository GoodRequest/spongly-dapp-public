import React from 'react'
import { PARLAY_LEADERBOARD_SORTING, TICKET_SORTING } from '@/utils/constants'
import { decodeSorter, setSort } from '@/utils/helpers'
import { getSortIcon } from '@/utils/tsxHelpers'
import * as SCS from '@/styles/GlobalStyles'
import SortIcon from '@/assets/icons/sort-icon.svg'

type Props = {
	title: string
	name?: PARLAY_LEADERBOARD_SORTING | TICKET_SORTING
}

const Sorter = (props: Props) => {
	const { name, title } = props
	const { property } = decodeSorter()
	return (
		<SCS.Sorter sorterName={name} onClick={() => name && setSort(name)}>
			{getSortIcon(name)}
			{name && property !== name && <img src={SortIcon} alt={'Sorter'} />}
			{title}
		</SCS.Sorter>
	)
}

export default Sorter
