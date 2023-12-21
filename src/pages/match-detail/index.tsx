import { GetStaticProps } from 'next'
import React from 'react'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/components/SEOHelmet'
import { IPage } from '@/typescript/types'
import MatchDetailContent from '@/content/matchesContent/MatchDetailContent'

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

const MatchDetailPage = (props: any) => <MatchDetailContent {...props} />

MatchDetailPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page?.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default MatchDetailPage
