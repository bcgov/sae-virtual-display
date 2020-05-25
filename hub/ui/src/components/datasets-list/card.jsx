import React from 'react';
import CalendarIcon from '@atlaskit/icon/glyph/calendar-filled';
import Lozenge from '@atlaskit/lozenge';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/24';
import DocumentIcon from '@atlaskit/icon/glyph/media-services/unknown';
import StarredView from '@src/views/starred';
import truncate from 'lodash/truncate';

import {
  CardHeader,
  CardContainer,
  CardIcon,
  CardContent,
  CardFooter,
} from './styles';

function Card({ data, starred }) {
  return (
    <CardContainer starred={starred} to={`/metadata/${data.id}`}>
      <CardIcon>
        <FileIcon />
        <StarredView id={data.id} />
      </CardIcon>
      <CardContent>
        <CardHeader>
          <h5>{data.title}</h5>
          {data.sector && <Lozenge appearance="moved">{data.sector}</Lozenge>}
        </CardHeader>
        <p>{truncate(data.notes, { length: 80 })}</p>
        <CardFooter>
          <div>
            <CalendarIcon size="small" />
            {data.recordCreateDate}
          </div>
          <div>
            <DocumentIcon size="small" />
            {data.numResources}
          </div>
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
}

export default Card;
