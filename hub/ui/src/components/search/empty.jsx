import React from 'react';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { colors } from '@atlaskit/theme';

import { EmptyText } from './styles';

function SearchEmpty({ data }) {
  return (
    <EmptyText>
      <div>
        <SearchIcon primaryColor={colors.subtleHeading} size="xlarge" />
        <h5>
          No search results for <em>{data}</em>
        </h5>
      </div>
    </EmptyText>
  );
}

export default SearchEmpty;
