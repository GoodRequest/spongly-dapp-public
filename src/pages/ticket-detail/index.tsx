import { GetStaticProps } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/atoms/SEOHelmet'
import { IPage } from '@/typescript/types'
import TicketDetailContent from '@/content/ticketDetailContent/TicketDetailContent'

export const getStaticProps: GetStaticProps<{ page: IPage<{}> }> = async () => {
	const page = {
		data: {},
		// TODO: currently not translated. should be added when languageswitcher is implemented.
		// TODO: fix seo tags for detail
		shareTags: {
			title: 'Tickets - Decentralized Ticket Copying from the Pros',
			description:
				'Secure your spot in the action with Spongly’s groundbreaking ticket feature. Experience the thrill of decentralized sports market ticket copying, directly emulating the strategies of top players. Don’t miss out and revolutionize your sports engagement today!'
		}
	}
	if (!page) return { notFound: true }

	return {
		props: {
			page
		}
	}
}

const TicketDetailPage = (props: any) => <TicketDetailContent {...props} />

TicketDetailPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default TicketDetailPage
