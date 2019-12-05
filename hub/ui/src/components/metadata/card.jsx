import React from 'react';
import { Link } from 'react-router-dom';
import Lozenge from '@atlaskit/lozenge';
import Spreadsheet48Icon from '@atlaskit/icon-file-type/glyph/spreadsheet/48';

import {
  CardHeader,
  CardContainer,
  CardIcon,
  CardContent,
  CardFooter,
} from './styles';

function Card({ data }) {
  return (
    <CardContainer>
      <CardIcon>
        <Spreadsheet48Icon />
      </CardIcon>
      <CardContent>
        <CardHeader>
          <h3>
            <Link to={`metadata/${data.id}`} className="list-group-item">
              {data.title}
            </Link>
          </h3>
          <Lozenge appearance="moved">{data.sector}</Lozenge>
        </CardHeader>
        <p>{data.lineageStatement}</p>
        <CardFooter>
          <small>
            Record published: {data.recordCreateDate} &bull;
            {data.numResources} resources available
          </small>
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
}

export default Card;
