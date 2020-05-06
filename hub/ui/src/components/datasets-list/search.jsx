import React, { useRef, useState } from 'react';
import Button from '@atlaskit/button';
import {
  DropdownMenuStateless,
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import Lozenge from '@atlaskit/lozenge';
import TextField from '@atlaskit/textfield';
import ClearIcon from '@atlaskit/icon/glyph/cross-circle';

import { Header, SearchField, Sector } from './styles';

function DatasetsListSearch({
  onClearSector,
  onFilter,
  onSort,
  sector,
  sortBy,
}) {
  const inputRef = useRef();
  const [open, setOpen] = useState(false);

  function onChange(event) {
    const { value } = event.target;
    onFilter(value);
  }

  function onClear() {
    if (inputRef.current) {
      onFilter('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }

  function onSelect(event) {
    return () => {
      const [key, value] = event.split(':');
      onSort({
        ...sortBy,
        [key]: value,
      });
      setOpen(false);
    };
  }

  return (
    <Header>
      <hgroup>
        <SearchField>
          <TextField
            ref={inputRef}
            elemAfterInput={
              inputRef.current &&
              inputRef.current.value && (
                <Button
                  appearance="subtle"
                  iconBefore={<ClearIcon />}
                  onClick={onClear}
                  spacing="compact"
                />
              )
            }
            placeholder="Filter Datasets"
            onChange={onChange}
          />
        </SearchField>
        <DropdownMenuStateless
          isOpen={open}
          onOpenChange={({ isOpen }) => setOpen(isOpen)}
          position="bottom right"
          trigger={<Button iconBefore={<FilterIcon />} />}
          testId="datasets-filters-dropdown"
        >
          <DropdownItemGroupRadio id="datasets-sortby" title="Sort By">
            <DropdownItemRadio
              defaultSelected={sortBy.sortBy === 'name'}
              id="name"
              onClick={onSelect('sortBy:name')}
            >
              Name
            </DropdownItemRadio>
            <DropdownItemRadio
              defaultSelected={sortBy.sortBy === 'recordPublishDate'}
              id="published"
              onClick={onSelect('sortBy:recordPublishDate')}
            >
              Date Published
            </DropdownItemRadio>
          </DropdownItemGroupRadio>
          <DropdownItemGroupRadio
            id="datasets-direction"
            title="Sort Direction"
          >
            <DropdownItemRadio
              defaultSelected={sortBy.sortDir === 'asc'}
              id="asc"
              onClick={onSelect('sortDir:asc')}
            >
              Ascending
            </DropdownItemRadio>
            <DropdownItemRadio
              defaultSelected={sortBy.sortDir === 'desc'}
              id="desc"
              onClick={onSelect('sortDir:desc')}
            >
              Descending
            </DropdownItemRadio>
          </DropdownItemGroupRadio>
        </DropdownMenuStateless>
      </hgroup>
      {sector && (
        <Sector>
          <h5>
            Sector: <Lozenge appearance="moved">{sector}</Lozenge>
          </h5>
          <Button
            iconBefore={<ClearIcon />}
            onClick={() => onClearSector(null)}
          >
            Clear
          </Button>
        </Sector>
      )}
    </Header>
  );
}

export default DatasetsListSearch;
