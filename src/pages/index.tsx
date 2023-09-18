import { GetStaticProps } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/atoms/SEOHelmet'
import { IPage } from '@/typescript/types'
import { PAGES } from '@/utils/enums'

export const getStaticProps: GetStaticProps<{ page: IPage<{}> }> = async () => {
	const page = {
		data: {},
		// TODO: currently not translated. should be added when languageswitcher is implemented.
		shareTags: {
			title: 'Dashboard - Your Gateway to Decentralized Sports Market Excellence',
			description:
				'Explore Spongly’s innovative dashboard, your portal to a decentralized sports market revolution. Access the best players’ ticket strategies and elevate your sports experience to new heights. Join us today!'
		}
	}
	if (!page) return { notFound: true }

	return {
		redirect: {
			destination: PAGES.DASHBOARD
		},
		props: {
			page
		}
	}
}

const HomePage = () => {
	return <h1>{PAGES.HOMEPAGE}</h1>
}

HomePage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default HomePage
