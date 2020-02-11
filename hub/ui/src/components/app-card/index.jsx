import React, { useContext } from 'react';
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
import WorkbenchContext from '@src/utils/context';

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

function AppCard({ data = {}, onClick, progress }) {
  const { imagesDir, staticURL } = useContext(WorkbenchContext);
  const isMissingImage = !data.logo || !staticURL || !imagesDir;
  const isBooting = isNumber(progress);

  function onAnchorClick(event) {
    event.stopPropagation();
  }

  return (
    <Card booting={isBooting} ready={data.ready} onClick={onClick}>
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
            Build Container
          </Button>
        )}
      </CardActions>
      {!isMissingImage && (
        <CardImg ready={data.ready}>
          <CoreImage
            fluid
            src={`${staticURL}${imagesDir}/${data.logo}.png`}
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
              headerText={`Starting ${data.label} container`}
              successText={`${data.label} container build complete`}
              value={progress}
            />
          </ProgressContainer>
        )}
        {!isBooting && (
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
            <Description>
              {data.description && <p>{data.description}</p>}
              {data.container && (
                <Button
                  appearance="link"
                  href="#"
                  spacing="compact"
                  iconAfter={<ShortcutIcon size="small" />}
                  onClick={onAnchorClick}
                >
                  View Container
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
