import React, { useRef, useState } from 'react';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import ClearIcon from '@atlaskit/icon/glyph/cross-circle';

import { Header } from './styles';

function DatasetsListSearch({ onFilter }) {
  const inputRef = useRef();

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

  return (
    <Header>
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
    </Header>
  );
}

export default DatasetsListSearch;
