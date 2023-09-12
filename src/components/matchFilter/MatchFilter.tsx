import { useTranslation } from 'next-export-i18n'
import { FC, useEffect, useState } from 'react'
import { find, includes, map } from 'lodash'
import { useRouter } from 'next/router'
import { useMedia } from '@/hooks/useMedia'

import Button from '@/atoms/button/Button'
import MobileSelect, { IMobileSelectItem } from '@/atoms/mobileSelect/MobileSelect'

import FilterCategory, { IFilterCategoryItem } from '@/components/filterCategory/FilterCategory'

import { SportFilterEnum, STATIC } from '@/utils/constants'
import { SPORTS_TAGS_MAP, TAGS_LIST } from '@/utils/tags'
import { RESOLUTIONS } from '@/utils/enums'

import * as SC from './MatchFilterStyles'

import CloseIcon from '@/assets/icons/close-icon-mobile.svg'
import { isBellowOrEqualResolution } from '@/utils/helpers'

export interface MatchFilterProps {
	onReset: () => void
	onShowResults: () => void
	onCloseMobileFilter: () => void
	resultsCount: number
}

export const DEFAULT_SELECTED_SPORT = { name: STATIC.ALL }
export const DEFAULT_SELECTED_LEAGUE = { id: STATIC.ALL }
const MatchFilter: FC<MatchFilterProps> = ({ onReset, onShowResults, resultsCount, onCloseMobileFilter }: MatchFilterProps) => {
	const router = useRouter()
	const { t } = useTranslation()
	const size = useMedia()

	const [selectedSport, setSelectedSport] = useState<IFilterCategoryItem>(DEFAULT_SELECTED_SPORT)
	const [selectedLeague, setSelectedLeague] = useState<IFilterCategoryItem>(DEFAULT_SELECTED_LEAGUE)
	const [isLoading, setIsLoading] = useState(false)

	// Set filter from url
	useEffect(() => {
		setSelectedSport({ name: (router.query.sport as string) || STATIC.ALL })
		setSelectedLeague({ id: Number.parseInt(router.query.league as string) || STATIC.ALL })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (router.isReady) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						sport: selectedSport?.name || 'all',
						league: selectedLeague?.id || 'all'
					}
				},
				undefined,
				{ shallow: true }
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSport, selectedLeague, router.isReady])

	const getLeaguesFilterItems = () => {
		if (selectedSport.name === STATIC.ALL) {
			return map(TAGS_LIST, (item) => ({ name: item?.label, country: item?.country, id: item?.id } as IFilterCategoryItem))
		}

		const sportName = selectedSport.name === 'Fighting sports' ? 'MMA' : (selectedSport.name as SportFilterEnum)
		return map(SPORTS_TAGS_MAP[sportName as SportFilterEnum], (sportId) => {
			const crntLeagueItem = find(TAGS_LIST, (item) => includes(item, sportId as any))
			return {
				name: crntLeagueItem?.label,
				country: crntLeagueItem?.country,
				id: crntLeagueItem?.id
			} as IFilterCategoryItem
		})
	}

	const getLeaguesSelectItems = () => {
		if (selectedSport.name === STATIC.ALL) {
			return map(TAGS_LIST, (item) => ({ label: item?.label, country: item?.country, value: item?.id } as IMobileSelectItem))
		}

		return map(SPORTS_TAGS_MAP[selectedSport.name as SportFilterEnum], (sportId) => {
			const crntLeagueItem = find(TAGS_LIST, (item) => includes(item, sportId as any))
			return {
				label: crntLeagueItem?.label,
				country: crntLeagueItem?.country,
				value: crntLeagueItem?.id
			} as IMobileSelectItem
		})
	}

	const filterButtons = (
		<SC.ButtonsWrapper>
			<Button
				btnStyle={'tertiary'}
				content={<span>{t('Clear filter')}</span>}
				onClick={() => {
					setSelectedSport(DEFAULT_SELECTED_SPORT)
					setSelectedLeague(DEFAULT_SELECTED_LEAGUE)
					onReset()
				}}
			/>
			<Button
				disabled={resultsCount === 0}
				btnStyle={'primary'}
				isLoading={isLoading}
				content={<span>{t('Show results ({{ resultsCount}})', { resultsCount })}</span>}
				onClick={() => {
					if (resultsCount) {
						setIsLoading(true)
						setTimeout(() => {
							setIsLoading(false)
							onShowResults()
						}, 300)
					}
				}}
			/>
		</SC.ButtonsWrapper>
	)

	return (
		<div>
			{isBellowOrEqualResolution(size, RESOLUTIONS.MD) ? (
				<SC.MobileFilter>
					<SC.MobileFilterContent>
						<SC.FilterTitle>{t('Filter')}</SC.FilterTitle>
						<SC.CloseBtn onClick={onCloseMobileFilter}>
							<SC.CloseIcon src={CloseIcon} style={{ strokeWidth: '2px' }} />
						</SC.CloseBtn>

						<MobileSelect
							options={[
								{
									label: t('All'),
									value: STATIC.ALL
								},
								...map(
									SportFilterEnum,
									(item) =>
										({
											label: item,
											value: item,
											img: item.toLowerCase()
										} as IMobileSelectItem)
								)
							]}
							onChange={(selectedValue: string) => {
								setSelectedSport({ name: selectedValue })
								setSelectedLeague({ id: STATIC.ALL })
							}}
							value={selectedSport.name}
							title={t('Sport')}
						/>
						<MobileSelect
							options={[
								{
									label: t('All'),
									value: STATIC.ALL
								},
								...getLeaguesSelectItems()
							]}
							onChange={(selectedValue: string) => {
								setSelectedLeague({ id: selectedValue })
							}}
							value={selectedLeague.id?.toString()}
							title={t('League')}
						/>
						{filterButtons}
					</SC.MobileFilterContent>
				</SC.MobileFilter>
			) : (
				<SC.Filter>
					<SC.FilterTitle>{t('Filter')}</SC.FilterTitle>
					<SC.FilterBody>
						<FilterCategory
							items={map(
								SportFilterEnum,
								(item) =>
									({
										name: item,
										img: item.toLowerCase()
									} as IFilterCategoryItem)
							)}
							setSelectedItem={(item: IFilterCategoryItem) => {
								setSelectedSport(item)
								setSelectedLeague({ id: STATIC.ALL })
							}}
							selectedItem={selectedSport.name}
							title={t('Sport')}
						/>
						{selectedSport.name !== STATIC.ALL && (
							<FilterCategory
								items={getLeaguesFilterItems()}
								setSelectedItem={(item: IFilterCategoryItem) => setSelectedLeague(item)}
								selectedItem={selectedLeague.id}
								title={t('League')}
							/>
						)}
						{filterButtons}
					</SC.FilterBody>
				</SC.Filter>
			)}
		</div>
	)
}

export default MatchFilter
