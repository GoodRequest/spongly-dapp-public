import { GetStaticProps } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/components/SEOHelmet'
import { IPage } from '@/typescript/types'
import ParlayLeaderboardContent from '@/content/ParlayLeaderboardContent/ParlayLeaderboardContent'

export const getStaticProps: GetStaticProps<{ page: IPage<{}> }> = async () => {
	const page = {
		data: {},
		// TODO: currently not translated. should be added when languageswitcher is implemented.
		shareTags: {
			title: 'Parlay Superstars - Elevate Your Game with Decentralized Ticket Replication',
			description:
				'Discover the power of the spongly.eth.limo Parlay Superstars, where top-performing players with exceptional win rates shine. Compare, analyze, and seamlessly copy their tickets in the decentralized sports market. Join now to revolutionize your sports engagement and amplify your chances of success!'
		}
	}
	if (!page) return { notFound: true }

	return {
		props: {
			page
		}
	}
}
const ParlaySuperstarsPage = (props: any) => <ParlayLeaderboardContent {...props} />

ParlaySuperstarsPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default ParlaySuperstarsPage
