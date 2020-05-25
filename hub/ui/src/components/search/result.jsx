import React, { useState } from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import Lozenge from '@atlaskit/lozenge';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import truncate from 'lodash/truncate';
import { uid } from 'react-uid';

import { ResourcesList, ResultItem } from './styles';

function SearchResult({ data }) {
  const [expanded, toggleExpanded] = useState(false);
  const defaultVisibleTotal = 3;
  const totalResources = get(data, 'resources.length', 0);
  const sliceEnd = expanded ? totalResources : defaultVisibleTotal;
  const resources = get(data, 'resources', []).slice(0, sliceEnd);
  const buttonText = expanded
    ? 'Show Less'
    : `Show ${totalResources - defaultVisibleTotal} More`;
  const buttonIcon = expanded ? <ChevronUpIcon /> : <ChevronDownIcon />;

  function onToggleExpanded() {
    toggleExpanded(state => !state);
  }

  return (
    <ResultItem>
      <header>
        <h4>
          <Link to={`/metadata/${data.id}`}>{data.title}</Link>
        </h4>
        <Lozenge appearance="moved">{data.sector}</Lozenge>
      </header>
      <p>{truncate(data.notes, { length: 200 })}</p>
      <ResourcesList>
        {resources.map(d => (
          <div key={uid(d)}>
            <SpreadsheetIcon />
            {d.name}
          </div>
        ))}
        {totalResources > defaultVisibleTotal && (
          <Button
            shouldFitContainer
            appearance="subtle"
            iconAfter={buttonIcon}
            iconBefore={buttonIcon}
            onClick={onToggleExpanded}
            spacing="compact"
          >
            {buttonText}
          </Button>
        )}
      </ResourcesList>
    </ResultItem>
  );
}

export default SearchResult;
