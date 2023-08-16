import { Form } from 'antd'
import { useForm, Resolver, Controller } from 'react-hook-form'
import { useTranslation } from 'next-export-i18n'
import { debounce } from 'lodash'

import { TICKET_TYPE } from '@/utils/constants'
import RadioButtons from '@/atoms/radioButtons/RadioButtons'
import { Option } from '@/typescript/types'
import { DEFAULT_TICKET_TYPE } from '@/content/ticketsContent/TicketsContent'

export type TicketsTypeFormValues = {
	ticketOptions?: TICKET_TYPE
}

type Props = {
	onFormSubmit: (values: TicketsTypeFormValues) => void
	value: TICKET_TYPE | undefined
}

const resolver: Resolver<TicketsTypeFormValues> = async (values: TicketsTypeFormValues) => {
	return {
		values: values?.ticketOptions ? values : {},
		errors: {}
	}
}

const debouncedSubmit = debounce((data: TicketsTypeFormValues, onFormSubmit) => {
	onFormSubmit(data)
}, 300)

const TicketsRadioButtonsForm = ({ onFormSubmit, value }: Props) => {
	const { t } = useTranslation()

	const { control, watch } = useForm<TicketsTypeFormValues>({ resolver, defaultValues: { ticketOptions: DEFAULT_TICKET_TYPE } })

	const ticketsOptions: Option[] = [
		{
			label: t('Open Tickets'),
			value: TICKET_TYPE.OPEN_TICKET
		},
		{
			label: t('Ongoing Tickets'),
			value: TICKET_TYPE.ONGOING_TICKET
		},
		{
			label: t('Closed Tickets'),
			value: TICKET_TYPE.CLOSED_TICKET
		}
	]

	watch((data) => {
		debouncedSubmit(data, onFormSubmit)
	})

	return (
		<Form>
			<Form.Item>
				<Controller
					name={'ticketOptions'}
					control={control}
					render={({ field: { onChange } }) => (
						<RadioButtons defaultValue={TICKET_TYPE.ONGOING_TICKET} options={ticketsOptions} onChange={onChange} value={value} />
					)}
				/>
			</Form.Item>
		</Form>
	)
}

export default TicketsRadioButtonsForm
