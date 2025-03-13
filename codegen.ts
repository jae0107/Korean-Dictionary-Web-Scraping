
import type { CodegenConfig } from '@graphql-codegen/cli';
import { IGraphQLConfig } from 'graphql-config';

const config: IGraphQLConfig = {
  projects: {
    default: {
      schema: [
        './src/app/api/**/*typedefs.ts',
      ],
      documents: [
        'src/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
      ],
      extensions: {
        codegen: {
          ignoreNoDocuments: true,
          generates: {
            './src/app/generated/gql/': {
              preset: 'client',
              plugins: [],
              presetConfig: {
                gqlTagName: 'gql',
                fragmentMasking: false,
              },
              config: {
                nonOptionalTypename: true,
              },
            },
          },
        },
      },
    },
  },
};

export default config;
