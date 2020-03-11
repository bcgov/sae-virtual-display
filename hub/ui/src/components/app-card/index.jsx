import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isNumber from 'lodash/isNumber';
import Lozenge from '@atlaskit/lozenge';
import OpenIcon from '@atlaskit/icon/glyph/media-services/open-mediaviewer';
import parseISO from 'date-fns/parseISO';
import Progress from '../core/progress';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

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

const getLozengeState = (ready, error) => {
  let appearance = 'default';
  let children = 'Idle';

  if (error) {
    appearance = 'removed';
    children = 'Failed';
  } else if (ready) {
    appearance = 'success';
    children = 'Running';
  }

  return {
    appearance,
    children,
  };
};

function AppCard({
  data,
  error,
  loading,
  message,
  onLaunch,
  onShutdown,
  onStartApp,
  progress,
  ready,
}) {
  const isMissingImage = !data.image;
  const isBooting = isNumber(progress) && !ready;

  function onAnchorClick(event) {
    event.stopPropagation();
  }

  function onClick() {
    if (ready) {
      onLaunch(data);
    } else {
      onStartApp();
    }
  }

  function onShutdownClick(event) {
    event.stopPropagation();
    onShutdown && onShutdown();
  }

  return (
    <Card
      data-testid="app-card"
      booting={isBooting}
      error={error}
      isLoading={loading}
      ready={ready}
      onClick={onClick}
    >
      <CardActions>
        {ready && !loading && (
          <ButtonGroup>
            <Button
              iconAfter={<CrossIcon primaryColor={colors.red} />}
              onClick={onShutdownClick}
            >
              Shutdown
            </Button>
            <Button iconAfter={<OpenIcon primaryColor={colors.green} />}>
              Launch
            </Button>
          </ButtonGroup>
        )}
        {loading && <Button isLoading>Loading...</Button>}
        {!ready && !loading && (
          <Button iconAfter={<SettingsIcon primaryColor={colors.green} />}>
            Build Application
          </Button>
        )}
      </CardActions>
      {!isMissingImage && (
        <CardImg grayscale={!loading && !ready} isLoading={isBooting}>
          <CoreImage
            fluid
            src={data.image}
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
            <Subtitle ready={ready}>
              {data.label}
              <Lozenge {...getLozengeState(ready, error)} isBold={ready} />
            </Subtitle>
            <small>
              {!ready && data.lastActivity
                ? `Application last used ${format(
                    parseISO(data.lastActivity),
                    'PPP',
                  )}`
                : ''}
              {ready &&
                `Running ${formatDistanceToNow(parseISO(data.started))}`}
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
