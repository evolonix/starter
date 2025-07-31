import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://rickandmortyapi.com/graphql',
  documents: ['libs/examples/rick-and-morty/data-access/src/**/*.graphql'],
  generates: {
    'libs/examples/rick-and-morty/data-access/src/lib/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
