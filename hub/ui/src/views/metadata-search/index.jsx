import React from 'react';
import get from 'lodash/get';
import Search from '@src/components/search';
import useMetadata from '@src/hooks/use-metadata';

function MetadataSearch() {
  const { data, error, request, status } = useMetadata('search');
  const results = get(data, 'results', []).filter(d =>
    d.groups.some(g => g.name === 'data-innovation-program'),
  );

  function onSearch(value) {
    request(`package_search?q=${value}`);
  }

  return <Search data={results} onSearch={onSearch} status={status} />;
}

export default MetadataSearch;
