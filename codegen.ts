import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: './src/utils/schema.graphql',
	// documents: 'src/**/**',
	generates: {
		'./src/__generated__/resolvers-types.ts': {
			plugins: ['typescript', 'typescript-resolvers']
		}
	}
}

export default config
