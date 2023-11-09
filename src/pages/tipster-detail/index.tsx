import { GetStaticProps } from 'next'
import React from 'react'
import Layout from '@/layout/layout/Layout'
import { IPage } from '@/typescript/types'
import MyWalletContent from '@/content/walletContent/WalletContent'
import SEOHelmet from '@/components/SEOHelmet'

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

const TipsterDetailPage = (props: any) => <MyWalletContent {...props} />

TipsterDetailPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default TipsterDetailPage
