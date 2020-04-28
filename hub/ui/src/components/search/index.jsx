import React, { useRef, useState } from 'react';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Spinner from '@atlaskit/spinner';
import TextField from '@atlaskit/textfield';
import { colors } from '@atlaskit/theme';

import { Container, Form, FormIcon, ResultsList } from './styles';
import SearchEmpty from './empty';
import SearchResult from './result';

function Search({ data = [], onSearch, status }) {
  const [term, setTerm] = useState('');
  const inputRef = useRef();
  const isLoading = status === 'loading';
  const isLoaded = status === 'loaded';

  function onSubmit(event) {
    event.preventDefault();

    if (inputRef.current) {
      const { value } = inputRef.current;
      onSearch(value);
      setTerm(value);
    }
  }

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <TextField
          ref={inputRef}
          isDisabled={isLoading}
          elemAfterInput={
            <FormIcon>
              {isLoading ? (
                <Spinner size="medium" />
              ) : (
                <SearchIcon primaryColor={colors.N50} />
              )}
            </FormIcon>
          }
          placeholder="Enter a search term (resource or dataset)"
        />
      </Form>
      {data.length <= 0 && isLoaded && <SearchEmpty data={term} />}
      {data.length > 0 && isLoaded && (
        <ResultsList>
          {data.map(d => (
            <SearchResult key={d.id} data={d} />
          ))}
        </ResultsList>
      )}
    </Container>
  );
}

export default Search;
