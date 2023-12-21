import React from 'react'
import * as SC from './TabsStyles'

export type TabItem = {
	key: string
	label: string
	children: any
}

type TabsProps = {
	items: TabItem[]
}

const Tabs: React.FC<TabsProps> = ({ items }) => {
	return (
		<SC.Wrapper>
			<SC.StyledTabs items={items} />
		</SC.Wrapper>
	)
}

export default Tabs
