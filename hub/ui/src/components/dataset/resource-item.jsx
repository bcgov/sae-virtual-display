import React from 'react';
import CsvIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/48';

import { ResourceItemContainer } from './styles';

function ResourceItem({ data, onClick }) {
  return (
    <ResourceItemContainer onClick={() => onClick(data)}>
      <div>
        <CsvIcon />
        <p>{`${data.name}.${data.format}`}</p>
      </div>
    </ResourceItemContainer>
  );
}

export default ResourceItem;
