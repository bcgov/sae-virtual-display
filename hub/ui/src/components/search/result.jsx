import React from 'react';
import { Link } from 'react-router-dom';
import Lozenge from '@atlaskit/lozenge';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import { uid } from 'react-uid';

import { ResourcesList, ResultItem } from './styles';

function SearchResult({ data }) {
  return (
    <ResultItem>
      <header>
        <h4>
          <Link to={`/metadata/${data.id}`}>{data.title}</Link>
        </h4>
        <Lozenge appearance="moved">{data.sector}</Lozenge>
      </header>
      <p>{data.notes}</p>
      <ResourcesList>
        {data.resources.map(d => (
          <div key={uid(d)}>
            <SpreadsheetIcon />
            {d.name}
          </div>
        ))}
      </ResourcesList>
    </ResultItem>
  );
}

export default SearchResult;
