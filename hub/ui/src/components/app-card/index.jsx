import React, { useContext } from 'react';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Lozenge from '@atlaskit/lozenge';
import parseIso from 'date-fns/parseIso';
import Progress from '../core/progress';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import WorkbenchContext from '@src/utils/context';

import CoreImage from '../core/image';
import {
  Card,
  CardActions,
  CardBody,
  CardImg,
  CardText,
  ProgressContainer,
  Subtitle,
} from './styles';

function AppCard({ booting, data, progress, style = {} }) {
  const { imagesDir, staticURL } = useContext(WorkbenchContext);

  return (
    <Card booting={booting} ready={data.ready} style={style}>
      <CardActions>
        {data.ready && (
          <Button iconAfter={<ShortcutIcon primaryColor={colors.green} />}>
            Launch
          </Button>
        )}
        {!data.ready && (
          <Button iconAfter={<SettingsIcon primaryColor={colors.green} />}>
            Build Container
          </Button>
        )}
      </CardActions>
      <CardImg ready={data.ready}>
        <CoreImage
          fluid
          src={`${staticURL}${imagesDir}/${data.logo}.png`}
          width={80}
          alt={`${data.label} Logo`}
          title={data.label}
        />
      </CardImg>
      <CardBody>
        {booting && (
          <ProgressContainer>
            <Progress value={progress} />
          </ProgressContainer>
        )}
        {!booting && (
          <CardText>
            <Subtitle ready={data.ready}>
              {data.label}
              <Lozenge
                appearance={data.ready ? 'success' : 'moved'}
                isBold={data.ready}
              >
                {data.ready ? 'Running' : 'Unbuilt'}
              </Lozenge>
            </Subtitle>
            <small>
              {data.lastActivity
                ? `Built on ${format(parseIso(data.lastActivity), 'PPP')}`
                : 'Container has not been started yet'}
              {data.ready &&
                ` | Running ${formatDistanceToNow(parseIso(data.started))}`}
            </small>
            <p>
              A brief description about the application can go here{' '}
              <Button
                appearance="link"
                href={`https://${data.container}`}
                spacing="compact"
                iconAfter={<ShortcutIcon size="small" />}
              >
                View Container
              </Button>
            </p>
          </CardText>
        )}
      </CardBody>
    </Card>
  );
}

export default AppCard;
