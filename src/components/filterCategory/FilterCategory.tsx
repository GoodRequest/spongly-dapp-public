import { FC } from 'react'
import { useTranslation } from 'next-export-i18n'
import map from 'lodash/map'
import Flag from 'react-world-flags'

import * as SC from './FilterCategoryStyles'
import { Icon } from '@/styles/Icons'
import * as SCS from '@/styles/GlobalStyles'
import { STATIC } from '@/utils/constants'

export interface IFilterCategoryItem {
	id?: string | number
	name?: string
	country?: string
	img?: string
}

interface IFilterCategory {
	items: IFilterCategoryItem[]
	setSelectedItem: (item: IFilterCategoryItem) => void
	selectedItem: string | number | undefined
	id?: string | number
	title: string
}
const FilterCategory: FC<IFilterCategory> = ({ items, setSelectedItem, selectedItem, title }) => {
	const { t } = useTranslation()
	return (
		<>
			{title && <SC.CategoryTitle>{title}</SC.CategoryTitle>}
			<SC.CategoryItems>
				<SC.CategoryItem selected={selectedItem === STATIC.ALL} onClick={() => setSelectedItem({ name: STATIC.ALL, id: STATIC.ALL })}>
					{t('All')}
				</SC.CategoryItem>
				{map(items, (item, key) => {
					return (
						<SC.CategoryItem
							selected={selectedItem === item.name || selectedItem === item.id}
							onClick={() => setSelectedItem(item)}
							key={`${key}-${item.id}`}
						>
							{item.img && <Icon className={`icon icon--${item.img}`} />}
							{item.country && item.country !== STATIC.WORLD && <Flag code={item.country} className={'flag'} />}
							{item.country && item.country === STATIC.WORLD && <SCS.FlagWorld />}
							{`${item.name}`}
						</SC.CategoryItem>
					)
				})}
			</SC.CategoryItems>
		</>
	)
}
export default FilterCategory
