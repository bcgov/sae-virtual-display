import React from 'react';
import AllIcon from '@atlaskit/icon/glyph/backlog';
import SearchIcon from '@atlaskit/icon/glyph/search';
import StarIcon from '@atlaskit/icon/glyph/star-large';

import NavButton from '../nav-button';
import { Container } from './styles';

function MetadataNav() {
  return (
    <Container>
      <NavButton
        appearance="subtle"
        iconBefore={<AllIcon primaryColor="#fff" />}
        href="/metadata"
        exact
      />
      <NavButton
        appearance="subtle"
        iconBefore={<SearchIcon primaryColor="#fff" />}
        href="/metadata/search"
      />
      <NavButton
        appearance="subtle"
        iconBefore={<StarIcon primaryColor="#fff" />}
        href="/metadata/starred"
      />
    </Container>
  );
}

export default MetadataNav;
