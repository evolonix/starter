import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Button, Input } from './catalyst';

interface SearchProps {
  initialQuery?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  onSearch: (query?: string) => void;
}

export const Search = ({
  initialQuery = '',
  disabled = false,
  autoFocus = false,
  className,
  onSearch,
}: SearchProps) => {
  const [query, setQuery] = useState<string>(initialQuery);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = (formData.get('query') ?? undefined) as string | undefined;
    onSearch(query || undefined);
  };

  const handleClearSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value === '') {
      onSearch();
      setQuery('');
    }
  };

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <form
      noValidate
      method="POST"
      onSubmit={handleSearch}
      className={clsx(className, 'flex items-center gap-2 pb-4')}
    >
      <Input
        type="search"
        name="query"
        placeholder="Search"
        value={query}
        autoFocus={autoFocus}
        onInput={handleClearSearch}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <Button type="submit" disabled={disabled}>
        Search
      </Button>
    </form>
  );
};
