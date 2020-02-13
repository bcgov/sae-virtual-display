import React, { useContext, useEffect, useState } from 'react';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isNumber from 'lodash/isNumber';
import Lozenge from '@atlaskit/lozenge';
import OpenIcon from '@atlaskit/icon/glyph/media-services/open-mediaviewer';
import parseIso from 'date-fns/parseIso';
import Progress from '../core/progress';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import useServer from '@src/hooks/use-server';

import CoreImage from '../core/image';
import {
  Card,
  CardActions,
  CardBody,
  CardImg,
  CardText,
  Description,
  ProgressContainer,
  Subtitle,
} from './styles';

function AppCard({ data = {}, onClick, onSpawned }) {
  const [status, startServer] = useServer({
    app: data.name,
  });
  const isMissingImage = !data.logo;
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);
  const isBooting = isNumber(progress);

  function onAnchorClick(event) {
    event.stopPropagation();
  }

  function onCardClick() {
    if (data.ready) {
      onClick(data);
    } else {
      startServer();
    }
  }

  useEffect(() => {
    let socket = null;

    if (data.progressUrl) {
      socket = new EventSource(data.progressUrl);
      socket.onmessage(event => {
        const message = JSON.parse(event.data);

        setProgress(message.progress);
        setMessage(message.html_message);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [data, setProgress, setMessage]);

  return (
    <Card
      booting={isBooting}
      error={status.error}
      ready={data.ready}
      onClick={onCardClick}
    >
      <CardActions>
        {data.ready && (
          <Button
            data-testid="app-card-launchBtn"
            iconAfter={<OpenIcon primaryColor={colors.green} />}
          >
            Launch
          </Button>
        )}
        {!data.ready && (
          <Button iconAfter={<SettingsIcon primaryColor={colors.green} />}>
            Build Application
          </Button>
        )}
      </CardActions>
      {!isMissingImage && (
        <CardImg ready={data.ready}>
          <CoreImage
            fluid
            src={data.logo}
            width={80}
            alt={`${data.label} Logo`}
            title={data.label}
          />
        </CardImg>
      )}
      <CardBody>
        {isBooting && (
          <ProgressContainer>
            <Progress
              headerText={`Starting ${data.label}`}
              message={message}
              successText={`${data.label} application build complete`}
              value={progress}
            />
          </ProgressContainer>
        )}
        {!isBooting && (
          <CardText>
            <Subtitle ready={data.ready}>
              {data.label}
              <Lozenge
                appearance={data.ready ? 'success' : 'default'}
                isBold={data.ready}
              >
                {data.ready ? 'Running' : 'Idle'}
              </Lozenge>
            </Subtitle>
            <small>
              {data.lastActivity
                ? `Built on ${format(parseIso(data.lastActivity), 'PPP')}`
                : 'Application has not been started yet'}
              {data.ready &&
                ` | Running ${formatDistanceToNow(parseIso(data.started))}`}
            </small>
            <Description>
              {data.description && <p>{data.description}</p>}
              {data.container && (
                <Button
                  appearance="link"
                  href={`https://${data.container}`}
                  spacing="compact"
                  iconAfter={<ShortcutIcon size="small" />}
                  onClick={onAnchorClick}
                >
                  View Info
                </Button>
              )}
            </Description>
          </CardText>
        )}
      </CardBody>
    </Card>
  );
}

export default AppCard;
