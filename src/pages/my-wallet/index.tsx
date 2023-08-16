import { GetStaticProps } from 'next'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/atoms/SEOHelmet'
import { IPage } from '@/typescript/types'
import MyWalletContent from '@/content/walletContent/WalletContent'

export const getStaticProps: GetStaticProps<{ page: IPage<{}> }> = async () => {
	const page = {
		data: {},
		// TODO: currently not translated. should be added when languageswitcher is implemented.
		shareTags: {
			title: 'My Wallet - Take direct control of your tickets on our platform and witness live match results',
			description:
				'Explore Spongly’s My Wallet page for efficient management of your sports market tickets. Experience the innovation of decentralized ticket copying from elite players, and conveniently track and manage your current tickets. Join now to elevate your sports engagement and witness game-changing results!'
		}
	}
	if (!page) return { notFound: true }

	return {
		props: {
			page
		}
	}
}

const MyWalletPage = (props: any) => <MyWalletContent {...props} />

MyWalletPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<SEOHelmet shareTags={page.props?.page?.shareTags} />
			<Layout>{page}</Layout>
		</>
	)
}
export default MyWalletPage
