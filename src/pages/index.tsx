import { GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { useRouter } from 'next-translate-routes'
import styled from 'styled-components'
import { Col, Row, Skeleton } from 'antd'
import Layout from '@/layout/layout/Layout'
import SEOHelmet from '@/components/SEOHelmet'
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
		props: {
			page
		}
	}
}

const RowSkeleton = styled(Skeleton)`
	.ant-skeleton-content {
		padding: 40px 60px;
		background: ${({ theme }) => theme['color-base-surface-secondary']};
		margin: 16px 0 16px 0;
		border-radius: 12px;
		h3,
		ul li {
			&::after {
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(0, 0, 0, 0.2) 37%, rgba(255, 255, 255, 0.05) 63%) !important;
			}
		}
	}
`

const HomePage = () => {
	const router = useRouter()

	useEffect(() => {
		router.push(PAGES.DASHBOARD)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// TODO: lading page in a future
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<RowSkeleton active loading paragraph={{ rows: 2 }} />
			</Col>
			<Col span={24}>
				<RowSkeleton active loading paragraph={{ rows: 2 }} />
			</Col>
			<Col span={24}>
				<RowSkeleton active loading paragraph={{ rows: 2 }} />
			</Col>
			<Col span={24}>
				<RowSkeleton active loading paragraph={{ rows: 2 }} />
			</Col>
		</Row>
	)
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
