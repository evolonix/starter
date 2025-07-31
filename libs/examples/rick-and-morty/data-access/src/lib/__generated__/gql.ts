/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}\n\nfragment CharacterDetails on Character {\n  ...CharacterSummary\n  episodes: episode {\n    ...EpisodeDetails\n  }\n  location {\n    ...LocationDetails\n  }\n  origin {\n    ...LocationDetails\n  }\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}": typeof types.CharacterSummaryFragmentDoc,
    "query Characters($page: Int, $filter: FilterCharacter) {\n  characters(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...CharacterDetails\n    }\n  }\n}\n\nquery CharacterById($id: ID!) {\n  character(id: $id) {\n    ...CharacterDetails\n  }\n}": typeof types.CharactersDocument,
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}": typeof types.CharacterSummaryFragmentDoc,
    "query Episodes($page: Int, $filter: FilterEpisode) {\n  episodes(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...EpisodeDetails\n    }\n  }\n}\n\nquery EpisodeById($id: ID!) {\n  episode(id: $id) {\n    ...EpisodeDetails\n  }\n}": typeof types.EpisodesDocument,
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}": typeof types.CharacterSummaryFragmentDoc,
    "query Locations($page: Int, $filter: FilterLocation) {\n  locations(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...LocationDetails\n    }\n  }\n}\n\nquery LocationById($id: ID!) {\n  location(id: $id) {\n    ...LocationDetails\n  }\n}": typeof types.LocationsDocument,
};
const documents: Documents = {
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}\n\nfragment CharacterDetails on Character {\n  ...CharacterSummary\n  episodes: episode {\n    ...EpisodeDetails\n  }\n  location {\n    ...LocationDetails\n  }\n  origin {\n    ...LocationDetails\n  }\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}": types.CharacterSummaryFragmentDoc,
    "query Characters($page: Int, $filter: FilterCharacter) {\n  characters(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...CharacterDetails\n    }\n  }\n}\n\nquery CharacterById($id: ID!) {\n  character(id: $id) {\n    ...CharacterDetails\n  }\n}": types.CharactersDocument,
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}": types.CharacterSummaryFragmentDoc,
    "query Episodes($page: Int, $filter: FilterEpisode) {\n  episodes(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...EpisodeDetails\n    }\n  }\n}\n\nquery EpisodeById($id: ID!) {\n  episode(id: $id) {\n    ...EpisodeDetails\n  }\n}": types.EpisodesDocument,
    "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}": types.CharacterSummaryFragmentDoc,
    "query Locations($page: Int, $filter: FilterLocation) {\n  locations(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...LocationDetails\n    }\n  }\n}\n\nquery LocationById($id: ID!) {\n  location(id: $id) {\n    ...LocationDetails\n  }\n}": types.LocationsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}\n\nfragment CharacterDetails on Character {\n  ...CharacterSummary\n  episodes: episode {\n    ...EpisodeDetails\n  }\n  location {\n    ...LocationDetails\n  }\n  origin {\n    ...LocationDetails\n  }\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}"): (typeof documents)["fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}\n\nfragment CharacterDetails on Character {\n  ...CharacterSummary\n  episodes: episode {\n    ...EpisodeDetails\n  }\n  location {\n    ...LocationDetails\n  }\n  origin {\n    ...LocationDetails\n  }\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Characters($page: Int, $filter: FilterCharacter) {\n  characters(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...CharacterDetails\n    }\n  }\n}\n\nquery CharacterById($id: ID!) {\n  character(id: $id) {\n    ...CharacterDetails\n  }\n}"): (typeof documents)["query Characters($page: Int, $filter: FilterCharacter) {\n  characters(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...CharacterDetails\n    }\n  }\n}\n\nquery CharacterById($id: ID!) {\n  character(id: $id) {\n    ...CharacterDetails\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}"): (typeof documents)["fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment EpisodeDetails on Episode {\n  id\n  name\n  air_date\n  episode\n  characters {\n    ...CharacterSummary\n  }\n  created\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Episodes($page: Int, $filter: FilterEpisode) {\n  episodes(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...EpisodeDetails\n    }\n  }\n}\n\nquery EpisodeById($id: ID!) {\n  episode(id: $id) {\n    ...EpisodeDetails\n  }\n}"): (typeof documents)["query Episodes($page: Int, $filter: FilterEpisode) {\n  episodes(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...EpisodeDetails\n    }\n  }\n}\n\nquery EpisodeById($id: ID!) {\n  episode(id: $id) {\n    ...EpisodeDetails\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}"): (typeof documents)["fragment CharacterSummary on Character {\n  id\n  name\n  status\n  species\n  type\n  gender\n  image\n  created\n}\n\nfragment LocationDetails on Location {\n  id\n  name\n  dimension\n  residents {\n    ...CharacterSummary\n  }\n  type\n  created\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query Locations($page: Int, $filter: FilterLocation) {\n  locations(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...LocationDetails\n    }\n  }\n}\n\nquery LocationById($id: ID!) {\n  location(id: $id) {\n    ...LocationDetails\n  }\n}"): (typeof documents)["query Locations($page: Int, $filter: FilterLocation) {\n  locations(page: $page, filter: $filter) {\n    info {\n      count\n      pages\n      next\n      prev\n    }\n    results {\n      ...LocationDetails\n    }\n  }\n}\n\nquery LocationById($id: ID!) {\n  location(id: $id) {\n    ...LocationDetails\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;