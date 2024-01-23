import React from 'react'
import { TabsProps } from 'antd'
import * as SC from './TabsStyles'

const Tabs: React.FC<TabsProps> = ({ items }) => {
	return (
		<SC.Wrapper>
			<SC.StyledTabs items={items} />
		</SC.Wrapper>
	)
}

export default Tabs
