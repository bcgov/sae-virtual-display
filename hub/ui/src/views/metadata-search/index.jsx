import React from 'react';
import Search from '@src/components/search';
import useMetadata from '@src/hooks/use-metadata';

function MetadataSearch() {
  // const { data, error, status } = useMetadata(`/action/package_search?q=${query}`);
  function onSearch(value) {
    console.log(value);
  }

  return <Search onSearch={onSearch} />;
}

export default MetadataSearch;
