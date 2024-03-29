import { Col, Spin } from 'antd'
import React from 'react'
import { useTranslation } from 'next-export-i18n'
import { LoadingOutlined } from '@ant-design/icons'
import SuccessRateIcon from '@/assets/icons/stat-successrate-icon.svg'
import ProfitsTicketsIcon from '@/assets/icons/stat-profits-icon.svg'
import TicketsIcon from '@/assets/icons/stat-balance-icon.svg'

import * as SC from './TabContentStyles'

type TabContentProps = {
	ticketCount?: number | null
	successRate?: number | null
	profit?: number | null
	isLoading: boolean
}

const TabContent: React.FC<TabContentProps> = ({ ticketCount, successRate, profit, isLoading }) => {
	const { t } = useTranslation()

	return (
		<SC.TabsRow gutter={16}>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={TicketsIcon} alt={t('ticket count icon')} />
					</SC.IconWrapper>
					<SC.RightSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{ticketCount || 0}</SC.ValueText>
								<SC.ValueTitle>{t('Tickets')}</SC.ValueTitle>
							</>
						)}
					</SC.RightSideWrapper>
				</SC.Wrapper>
			</Col>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={SuccessRateIcon} alt={t('success rate icon')} />
					</SC.IconWrapper>
					<SC.RightSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{successRate || 0} %</SC.ValueText>
								<SC.ValueTitle>{t('Win rate')}</SC.ValueTitle>
							</>
						)}
					</SC.RightSideWrapper>
				</SC.Wrapper>
			</Col>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={ProfitsTicketsIcon} alt={t('profits icon')} />
					</SC.IconWrapper>
					<SC.RightSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{(profit || 0) > 0 ? `+${profit}` : profit || 0} $</SC.ValueText>
								<SC.ValueTitle>{t('Profits')}</SC.ValueTitle>
							</>
						)}
					</SC.RightSideWrapper>
				</SC.Wrapper>
			</Col>
		</SC.TabsRow>
	)
}

export default TabContent
