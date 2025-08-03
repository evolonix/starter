import {
  GridLayout,
  GridLayoutItem,
  PageHeader,
  Search as UiSearch,
} from '@~~_.starter.name_~~/ui';

export const Search = () => {
  return (
    <>
      <PageHeader label="Search" />
      <GridLayout>
        <GridLayoutItem>
          <UiSearch
            className="max-w-80"
            autoFocus
            onSearch={(query) => {
              console.log('Search query:', query);
            }}
          />
        </GridLayoutItem>
      </GridLayout>
    </>
  );
};

export default Search;
