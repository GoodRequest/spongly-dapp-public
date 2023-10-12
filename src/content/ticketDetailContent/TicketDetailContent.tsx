import React, { useEffect } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'

const TicketDetailContent = () => {
	const { t } = useTranslation()
	const router = useRouter()

	const fetchData = () => {
		console.log('i fetch')
	}

	useEffect(() => {
		if (router.query.id) {
			console.log(router.query.id)
			fetchData()
		}
		// else {
		// 	NOTE: redirect to 404?
		// }
	}, [router.query.id])

	return <span>Dzengala</span>
}

export default TicketDetailContent
