import { Option } from '@/typescript/types'
import * as SC from './RadioButtonsStyles'

type Props = {
	options: Option[]
	defaultValue?: string | number
	value?: string | number
	onChange: (event: any) => void
	input?: any
	minimizeFirstOption?: boolean
	counts?: { value: string | number; count: number | undefined }[]
}

const RadioButtons = ({ input, options, defaultValue, onChange, value, minimizeFirstOption, counts }: Props) => {
	const getCountBubble = (value: string | number) => {
		if (!counts) return undefined

		const foundCount = counts.find((item) => item.value === value)
		if (!foundCount || foundCount.count === 0) return undefined

		return foundCount.count
	}

	const radioOptions = options?.map((option, index) => {
		return (
			<SC.RadioButton {...input} key={option.value} value={option?.value} $minimized={minimizeFirstOption && index === 0}>
				<SC.ContentWrapper>
					{getCountBubble(option.value) && <SC.CountBubble>{getCountBubble(option.value)}</SC.CountBubble>}
					{option?.label}
				</SC.ContentWrapper>
			</SC.RadioButton>
		)
	})

	return (
		<SC.RadioGroup onChange={onChange} value={value} defaultValue={defaultValue} buttonStyle={'solid'} size={'large'}>
			{radioOptions}
		</SC.RadioGroup>
	)
}

export default RadioButtons
