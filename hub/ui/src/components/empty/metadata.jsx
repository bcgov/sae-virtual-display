import React from 'react';
import DatasetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import Button from '@src/components/nav-button';
import SearchIcon from '@atlaskit/icon/glyph/search';

import { MetadataContainer } from './styles';

function MetadataEmpty() {
  return (
    <MetadataContainer>
      <div>
        <DatasetIcon />
        <h3>Welcome to the Metadata Browser</h3>
        <p>
          Browser, view and star datasets for BBSAE for quick and easy
          reference.
        </p>
        <p>
          <Button
            appearance="primary"
            href="/metadata/search"
            iconBefore={<SearchIcon size="xsmall" />}
          >
            Search Datasets
          </Button>
        </p>
      </div>
    </MetadataContainer>
  );
}

export default MetadataEmpty;
