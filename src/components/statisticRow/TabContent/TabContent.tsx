import { Col, Row, Spin } from 'antd'
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
	profits?: number | null
	isLoading: boolean
}

const TabContent: React.FC<TabContentProps> = ({ ticketCount, successRate, profits, isLoading }) => {
	const { t } = useTranslation()

	return (
		<Row style={{ marginLeft: '-16px' }} gutter={16}>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={TicketsIcon} alt={'ticket-count-icon'} />
					</SC.IconWrapper>
					<SC.LeftSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{ticketCount}</SC.ValueText>
								<SC.ValueTitle>{t('Tickets')}</SC.ValueTitle>
							</>
						)}
					</SC.LeftSideWrapper>
				</SC.Wrapper>
			</Col>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={SuccessRateIcon} alt={'success-rate-icon'} />
					</SC.IconWrapper>
					<SC.LeftSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{successRate} %</SC.ValueText>
								<SC.ValueTitle>{t('Win rate')}</SC.ValueTitle>
							</>
						)}
					</SC.LeftSideWrapper>
				</SC.Wrapper>
			</Col>
			<Col>
				<SC.Wrapper>
					<SC.IconWrapper>
						<img src={ProfitsTicketsIcon} alt={'profits-icon'} />
					</SC.IconWrapper>
					<SC.LeftSideWrapper>
						{isLoading ? (
							<Spin indicator={<LoadingOutlined spin />} />
						) : (
							<>
								<SC.ValueText>{profits} $</SC.ValueText>
								<SC.ValueTitle>{t('Profits')}</SC.ValueTitle>
							</>
						)}
					</SC.LeftSideWrapper>
				</SC.Wrapper>
			</Col>
		</Row>
	)
}

export default TabContent
