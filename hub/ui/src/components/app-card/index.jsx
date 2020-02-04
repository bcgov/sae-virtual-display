import React from 'react';
import { colors } from '@atlaskit/theme';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseIso from 'date-fns/parseIso';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';
import PresenceBusyIcon from '@atlaskit/icon/glyph/presence-busy';
import Progress from '../core/progress';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';

import CoreImage from '../core/image';
import {
  Card,
  CardActions,
  CardBody,
  CardIcon,
  CardImg,
  CardText,
  ProgressContainer,
  Subtitle,
} from './styles';

function AppCard({ booting, data, progress, style = {} }) {
  const iconEl = (
    <CardIcon>
      {data.ready && (
        <PresenceActiveIcon primaryColor={colors.green} label="Running" />
      )}
      {!data.ready && (
        <PresenceBusyIcon primaryColor={colors.subtleText} label="Idle" />
      )}
    </CardIcon>
  );

  return (
    <Card booting={booting} style={style}>
      <CardActions>
        {data.ready && <ShortcutIcon primaryColor={colors.primary} />}
        {!data.ready && <VidPlayIcon primaryColor={colors.green} />}
      </CardActions>
      <CardImg>
        <CoreImage fluid src={data.image} width={80} />
      </CardImg>
      <CardBody>
        {booting && (
          <ProgressContainer>
            <Progress value={progress} />
          </ProgressContainer>
        )}
        {!booting && (
          <CardText>
            <Subtitle>
              {data.label} {iconEl}
            </Subtitle>
            <small>
              Version {data.version}
              {' | '}
              {`Built on ${format(parseIso(data.lastActivity), 'PPP')}`}
              {data.ready &&
                ` | Running ${formatDistanceToNow(parseIso(data.started))}`}
            </small>
            <p>A brief description about the application can go here</p>
          </CardText>
        )}
      </CardBody>
    </Card>
  );
}

export default AppCard;
