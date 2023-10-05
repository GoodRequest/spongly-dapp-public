import React from 'react'
import { Tooltip } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { LEADERBOARD_SORTING, PARLAY_LEADERBOARD_SORTING, TICKET_SORTING } from '@/utils/constants'
import { decodeSorter, setSort } from '@/utils/helpers'
import { getSortIcon } from '@/utils/tsxHelpers'
import * as SCS from '@/styles/GlobalStyles'
import SortIcon from '@/assets/icons/sort-icon.svg'

type Props = {
	title: string
	name?: PARLAY_LEADERBOARD_SORTING | TICKET_SORTING | LEADERBOARD_SORTING
	disabled?: boolean
}

const Sorter = (props: Props) => {
	const { name, title, disabled } = props
	const { property } = decodeSorter()
	const { t } = useTranslation()
	return (
		<Tooltip title={disabled ? t('Currently not available') : undefined}>
			<SCS.Sorter disabled={disabled} sorterName={name} onClick={() => name && !disabled && setSort(name)}>
				{getSortIcon(name)}
				{name && property !== name && <img src={SortIcon} alt={'Sorter'} />}
				{title}
			</SCS.Sorter>
		</Tooltip>
	)
}

export default Sorter
