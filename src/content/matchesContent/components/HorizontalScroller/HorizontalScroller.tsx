import { FC, useRef, useState, useEffect } from 'react'
import map from 'lodash/map'
import Flag from 'react-world-flags'

import { useTranslation } from 'next-export-i18n'
import * as SC from './HorizontalScrollerStyles'
import * as SCS from '@/styles/GlobalStyles'
import { Icon } from '@/styles/Icons'

import arrowRightIcon from '@/assets/icons/arrow-right.svg'

interface IHorizontalScroller {
	items: any
	setSelectedItem: any
	selectedItem: any
	id?: string | number
}

enum SCROLL_DIRECTION {
	RIGHT = 'right',
	LEFT = 'left'
}

const HorizontalScroller: FC<IHorizontalScroller> = ({ items, setSelectedItem, selectedItem }) => {
	const ref: any = useRef()
	const { t } = useTranslation()
	const [visibleArrowLeft, setVisibleArrowsLeft] = useState(false)
	const [visibleArrowRight, setVisibleArrowsRight] = useState(true)
	const [visibleArrows, setVisibleArrows] = useState(false)

	const handleScroll = (direction: SCROLL_DIRECTION) => {
		if (direction === SCROLL_DIRECTION.RIGHT) {
			ref?.current?.scroll({ left: (ref?.current?.scrollLeft as number) + 350, behavior: 'smooth' })
		}
		if (direction === SCROLL_DIRECTION.LEFT) {
			ref?.current?.scroll({ left: (ref?.current?.scrollLeft as number) - 350, behavior: 'smooth' })
		}
	}

	const handleScrollListener = (event: any) => {
		const maxScrollLeft = event.target.scrollWidth - event.target.clientWidth
		if (event.target.scrollLeft === 0) {
			setVisibleArrowsLeft(false)
		}
		if (event.target.scrollLeft !== 0) {
			setVisibleArrowsLeft(true)
		}
		if (event.target.scrollLeft === maxScrollLeft) {
			setVisibleArrowsRight(false)
		}
		if (event.target.scrollLeft !== maxScrollLeft) {
			setVisibleArrowsRight(true)
		}
	}

	useEffect(() => {
		ref?.current?.addEventListener('scroll', handleScrollListener)
		// eslint-disable-next-line react-hooks/exhaustive-deps
		return () => ref?.current?.removeEventListener('scroll', handleScrollListener)
	}, [])

	useEffect(() => {
		setVisibleArrows(ref?.current?.scrollWidth > ref?.current?.clientWidth)
		if (visibleArrows) setVisibleArrowsRight(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref?.current?.scrollWidth])

	return (
		<SC.ScrollerChipses ref={ref}>
			<SC.ScrollerChips selected={selectedItem === 'all'} onClick={() => setSelectedItem({ name: 'all', id: 'all' })}>
				{t('All')}
			</SC.ScrollerChips>
			{map(items, (item, key) => {
				return (
					<SC.ScrollerChips selected={selectedItem === item.name || selectedItem === item.id} onClick={() => setSelectedItem(item)} key={key}>
						{item.img && <Icon className={`icon icon--${item.img}`} />}
						{item.country && item.country !== 'WORLD' && <Flag code={item.country} className={'flag'} />}
						{item.country && item.country === 'WORLD' && <SCS.FlagWorld />}
						{`${item.name}`}
					</SC.ScrollerChips>
				)
			})}

			{visibleArrows && (
				<>
					{visibleArrowRight && (
						<SC.GradientLoss direction={SCROLL_DIRECTION.RIGHT}>
							<SC.ScrollerChips onClick={() => handleScroll(SCROLL_DIRECTION.RIGHT)}>
								<SC.ImgIcon src={arrowRightIcon} />
							</SC.ScrollerChips>
						</SC.GradientLoss>
					)}
					{visibleArrowLeft && (
						<SC.GradientLoss direction={SCROLL_DIRECTION.LEFT}>
							<SC.ScrollerChips onClick={() => handleScroll(SCROLL_DIRECTION.LEFT)}>
								<SC.ImgIcon src={arrowRightIcon} />
							</SC.ScrollerChips>
						</SC.GradientLoss>
					)}
				</>
			)}
		</SC.ScrollerChipses>
	)
}

export default HorizontalScroller
