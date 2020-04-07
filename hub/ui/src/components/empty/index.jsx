import React from 'react';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import FailedIcon from '@atlaskit/icon/glyph/jira/failed-build-status';
import { colors } from '@atlaskit/theme';

import { Container, Text } from './styles';

function Empty({ status }) {
  const isError = status === 'error';
  let icon = <VidFullScreenOnIcon primaryColor={colors.N50} size="xlarge" />;
  let title = 'No Applications Available';
  const text = 'Please try refreshing the page';

  if (isError) {
    icon = <FailedIcon primaryColor={colors.red} size="xlarge" />;
    title = 'Request Failed';
  }

  return (
    <Container>
      {icon}
      <h3>{title}</h3>
      <Text>{text}</Text>
    </Container>
  );
}

export default Empty;
