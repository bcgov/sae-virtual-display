import React from 'react';
import Button from '@atlaskit/button';
import AllIcon from '@atlaskit/icon/glyph/backlog';
import SearchIcon from '@atlaskit/icon/glyph/search';
import StarIcon from '@atlaskit/icon/glyph/star-large';

import NavButton from '../nav-button';
import { Container } from './styles';

function MetadataNav({ onToggleStarred, starred }) {
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
      <Button
        appearance="subtle"
        isSelected={starred}
        iconBefore={<StarIcon primaryColor="#fff" />}
        onClick={onToggleStarred}
      />
    </Container>
  );
}

export default MetadataNav;
