import React from 'react';
import Button, { ButtonGroup} from '@atlaskit/button'
import Textfield from '@atlaskit/textfield'

import { Container } from './styles'

function Filters() {
  return (
    <Container>
      <div>
        <Textfield placeholder="Filter" width="medium"/>
      </div>
      <ButtonGroup>
        <Button>Grid</Button>
        <Button>List</Button>
      </ButtonGroup>
    </Container>
  )
}

export default Filters;
