import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/24';

import {
  CardHeader,
  CardContainer,
  CardIcon,
  CardContent,
  CardFooter,
} from './styles';

function Card({ data }) {
  return (
    <CardContainer to={`/metadata/${data.id}`}>
      <CardIcon>
        <FileIcon />
      </CardIcon>
      <CardContent>
        <CardHeader>
          <h5>{data.title}</h5>
          {data.sector && <Lozenge appearance="moved">{data.sector}</Lozenge>}
        </CardHeader>
        <CardFooter>
          <small>
            {data.recordCreateDate} &bull;
            {data.numResources} resources available
          </small>
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
}

export default Card;
