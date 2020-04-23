import React from 'react';
import Button from '@atlaskit/button';
import AllIcon from '@atlaskit/icon/glyph/backlog';
import SearchIcon from '@atlaskit/icon/glyph/search';
import StarIcon from '@atlaskit/icon/glyph/star-large';

import { Container } from './styles';
function MetadataNav() {
  return (
    <Container>
      <Button appearance="subtle" iconBefore={<AllIcon />} />
      <Button appearance="subtle" iconBefore={<SearchIcon />} />
      <Button appearance="subtle" iconBefore={<StarIcon />} />
    </Container>
  );
}

export default MetadataNav;
