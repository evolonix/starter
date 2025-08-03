## [GraphQL](https://graphql.org/) and [Apollo Client](https://www.apollographql.com/docs/react/)

```bash
npm install @apollo/client graphql
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
npm run update-deps
```

Update nx.json:

```json
{
  "targetDefaults": {
    "codegen": {
      "cache": true,
      "outputs": ["{projectRoot}/src/__generated__"],
      "inputs": ["{projectRoot}/**/*.graphql"],
      "dependsOn": ["^codegen"]
    }
  }
}
```

Create `codegen.ts` in the library root:

```ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://rickandmortyapi.com/graphql',
  documents: ['libs/rick-and-morty/characters/data-access/src/**/*.graphql'],
  generates: {
    'libs/rick-and-morty/characters/data-access/src/lib/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
```

Add `codegen` target to the library's package.json:

```json
"nx": {
  "targets": {
    "codegen": {
      "command": "npx graphql-codegen --config {projectRoot}/codegen.ts"
    }
  }
}
```

Update the app's `vite.config.ts` to handle SSR and Apollo Client:

```ts
export default defineConfig(() => ({
  ...
  ssr: {
    noExternal: ['@apollo/client'],
  },
}));
```

To generate the GraphQL types, run:

```bash
npx nx codegen rick-and-morty-characters-data-access
```
