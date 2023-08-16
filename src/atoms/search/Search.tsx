import { SearchOutlined } from '@ant-design/icons'
import { trimStart } from 'lodash'
import React from 'react'

import { InputProps } from 'antd'
import * as SC from './SearchStyles'

type Props = InputProps

const Search = ({ placeholder, value, onChange }: Props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val: any = e.target.value ? trimStart(e.target.value) : null
		if (onChange) {
			onChange(val)
		}
	}

	return <SC.Search placeholder={placeholder} value={value} onChange={handleChange} suffix={<SearchOutlined />} allowClear={true} />
}

export default Search
