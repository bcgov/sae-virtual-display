import React, { useRef, useState } from 'react';
import Button from '@atlaskit/button';
import {
  DropdownMenuStateless,
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import TextField from '@atlaskit/textfield';
import ClearIcon from '@atlaskit/icon/glyph/cross-circle';

import { Header, SearchField } from './styles';

function DatasetsListSearch({ onFilter, onSort, sortBy }) {
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
        <DropdownItemGroupRadio id="datasets-sortby" title="Sorty By">
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
        <DropdownItemGroupRadio id="datasets-direction" title="Sort Direction">
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
    </Header>
  );
}

export default DatasetsListSearch;
