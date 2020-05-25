import React, { useState } from 'react';
import {
  DropdownMenuStateless,
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';
import Spinner from '@atlaskit/spinner';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Textfield from '@atlaskit/textfield';

import { Container } from './styles';

function Filters({ hideIdle, onSearch, onFilter, onSort, status }) {
  const [open, setOpen] = useState(false);

  function onSelect(event) {
    const [action, value] = event.split(':');
    return () => {
      setOpen(false);
      if (action === 'filter') {
        onFilter();
      } else {
        onSort(value);
      }
    };
  }

  return (
    <Container>
      <SpotlightTarget name="home-filter-apps">
        <Textfield
          type="search"
          placeholder="Filter"
          onChange={event => onSearch(event.target.value)}
          width="medium"
          testId="server-filters-search"
        />
      </SpotlightTarget>
      {status === 'loading' && <Spinner />}
      <SpotlightTarget name="home-toggle-apps">
        <div>
          <DropdownMenuStateless
            isOpen={open}
            onOpenChange={({ isOpen }) => setOpen(isOpen)}
            position="bottom right"
            triggerType="button"
            trigger="Filter/Sort"
            testId="server-filters-dropdown"
          >
            <DropdownItemGroupRadio id="sort" title="Sort">
              <DropdownItemRadio
                defaultSelected
                id="name"
                onClick={onSelect('sort:name')}
              >
                Alphabetically
              </DropdownItemRadio>
              <DropdownItemRadio id="ready" onClick={onSelect('sort:ready')}>
                Active
              </DropdownItemRadio>
            </DropdownItemGroupRadio>
            <DropdownItemGroupRadio id="filter" title="Filter">
              <DropdownItemRadio
                defaultSelected
                id="all"
                onClick={onSelect('filter')}
              >
                All Applications
              </DropdownItemRadio>
              <DropdownItemRadio id="active" onClick={onSelect('filter')}>
                Active
              </DropdownItemRadio>
            </DropdownItemGroupRadio>
          </DropdownMenuStateless>
        </div>
      </SpotlightTarget>
    </Container>
  );
}

export default Filters;
