import React, { useState } from 'react'
import * as SC from './SwitchButtonStyles'
import { SWITCH_BUTTON_OPTIONS } from '@/utils/enums'

type Props = {
	option1: string
	option2: string
	onClick: (segment: SWITCH_BUTTON_OPTIONS) => void
}

const SwitchButton = ({ option1, option2, onClick }: Props) => {
	const [activeSegment, setActiveSegment] = useState(SWITCH_BUTTON_OPTIONS.OPTION_1)

	const handleSegmentClick = (segment: SWITCH_BUTTON_OPTIONS) => {
		setActiveSegment(segment)
		onClick(segment)
	}

	return (
		<SC.SwitchContainer>
			<SC.Segment active={activeSegment === SWITCH_BUTTON_OPTIONS.OPTION_1} onClick={() => handleSegmentClick(SWITCH_BUTTON_OPTIONS.OPTION_1)}>
				{option1}
			</SC.Segment>
			<SC.Segment active={activeSegment === SWITCH_BUTTON_OPTIONS.OPTION_2} onClick={() => handleSegmentClick(SWITCH_BUTTON_OPTIONS.OPTION_2)}>
				{option2}
			</SC.Segment>
		</SC.SwitchContainer>
	)
}

export default SwitchButton
