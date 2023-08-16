import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/atoms/SEOHelmet'
import { IPage } from '@/typescript/types'
import MatcheDetailContent from '@/content/matchesContent/MatchDetailContent'

export const getStaticProps: GetStaticProps<{ page: IPage<{}> }> = async () => {
	const page = {
		data: {},
		// TODO: currently not translated. should be added when languageswitcher is implemented.
		shareTags: {
			title: 'Matches - Decentralized Ticket Copying for Ultimate Sports Market Success',
			description:
				'Dive into Spongly’s Matches feature, where decentralized sports market innovation meets ticket replication from the finest players. Amplify your sports engagement by mirroring top-tier strategies. Join us now to redefine the way you experience sports!'
		}
	}
	if (!page) return { notFound: true }

	return {
		props: {
			page
		}
	}
}

export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: [],
		fallback: 'blocking'
	}
}

const MatchesPage = (props: any) => <MatcheDetailContent {...props} />

MatchesPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default MatchesPage
