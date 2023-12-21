import { GetStaticProps } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/components/SEOHelmet'
import { IPage } from '@/typescript/types'
import DashboardContent from '@/content/dashboardContent/DashboardContent'

interface IHomepage {
	attributes?: any
}

export const getStaticProps: GetStaticProps<{ page: IPage<IHomepage> }> = async () => {
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
		props: {
			page
		}
	}
}

const DashboardPage = (props: any) => <DashboardContent {...props} />

DashboardPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}

export default DashboardPage
