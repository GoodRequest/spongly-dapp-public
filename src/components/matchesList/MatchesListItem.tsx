import { FC, useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next-translate-routes'
import { useTranslation } from 'next-export-i18n'

// components
import MatchListContent from './MatchListContent'
import MatchListHeader from './MatchListHeader'
import Button from '@/atoms/button/Button'

// types
import { SportMarket } from '@/__generated__/resolvers-types'

// utils
import { MATCHES, PAGES } from '@/utils/enums'

// styles
import * as SC from './MatchesListStyles'

import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'

interface IMatchListItem {
	match: SportMarket & {
		winnerTypeMatch?: SportMarket
		doubleChanceTypeMatches?: SportMarket[]
		spreadTypeMatch?: SportMarket
		totalTypeMatch?: SportMarket
	}
	filter: {
		status: MATCHES
		league: string
		sport: string
	}
	keyValue: string | number
	loading?: boolean
	setVisibleTotalWinnerModal: Dispatch<SetStateAction<boolean>>
}

const MatchListItem: FC<IMatchListItem> = ({ match, keyValue, filter, loading = false, setVisibleTotalWinnerModal }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const router = useRouter()
	const { t } = useTranslation()
	const collapsible =
		filter.status === MATCHES.OPEN || (match.isOpen && !match.isCanceled && !match.isResolved && !match.isPaused && filter.status !== MATCHES.ONGOING)

	return (
		<SC.MatchCollapse
			onChange={() => setIsExpanded(!isExpanded)}
			activeKey={isExpanded ? [match.maturityDate] : []}
			collapsible={collapsible ? 'icon' : 'disabled'}
			expandIconPosition={'end'}
			isExpanded={isExpanded}
			key={keyValue}
		>
			<SC.CollapsePanel
				header={<MatchListHeader match={match as any} type={filter.status} setVisibleTotalWinnerModal={setVisibleTotalWinnerModal} />}
				key={match.maturityDate}
			>
				{!loading && match.isOpen && isExpanded && <MatchListContent match={match as any} setVisibleTotalWinnerModal={setVisibleTotalWinnerModal} />}
				<Button
					style={{ marginTop: '24px' }}
					type={'primary'}
					btnStyle={'secondary'}
					size={'middle'}
					onClick={() => router.push(`/${PAGES.MATCHES}/${match.id}`)}
					content={<span>{t('Show match details')}</span>}
				/>
			</SC.CollapsePanel>
			{filter.status === MATCHES.OPEN && (
				<SC.CollapseButtonWrapper>
					<Button
						type={'primary'}
						btnStyle={'secondary'}
						onClick={() => setIsExpanded(!isExpanded)}
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}
						content={<SC.ButtonIcon src={ArrowDownIcon} style={isExpanded ? { transform: 'rotate(180deg)' } : {}} />}
					/>
				</SC.CollapseButtonWrapper>
			)}
		</SC.MatchCollapse>
	)
}

export default MatchListItem
