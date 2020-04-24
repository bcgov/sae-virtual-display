import React from 'react';
import CalendarIcon from '@atlaskit/icon/glyph/calendar-filled';
import Lozenge from '@atlaskit/lozenge';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/24';
import DocumentIcon from '@atlaskit/icon/glyph/media-services/unknown';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import StarIcon from '@atlaskit/icon/glyph/star';
import truncate from 'lodash/truncate';
import { colors } from '@atlaskit/theme';

import {
  CardHeader,
  CardContainer,
  CardIcon,
  CardContent,
  CardFooter,
  StarredButton,
} from './styles';

function Card({ data, onStarred, starred }) {
  function onStarClick(event) {
    event.stopPropagation();
    onStarred();
    return false;
  }

  return (
    <CardContainer starred={starred} to={`/metadata/${data.id}`}>
      <CardIcon>
        <FileIcon />
        <StarredButton
          appearance="subtle"
          spacing="compact"
          iconBefore={
            starred ? (
              <StarFilledIcon primaryColor={colors.yellow} />
            ) : (
              <StarIcon primaryColor={colors.subtleText} />
            )
          }
          onClick={onStarClick}
        />
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
