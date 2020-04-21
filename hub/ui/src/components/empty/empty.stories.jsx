import React from 'react';
import { colors } from '@atlaskit/theme';

import Empty from './index';

export default {
  title: 'Empty View',
  component: Empty,
  decorators: [
    storyFn => (
      <div style={{ padding: 20, backgroundColor: colors.skeleton }}>
        {storyFn()}
      </div>
    ),
  ],
};

export const NoContent = () => <Empty status="success" />;
export const ErrorContent = () => <Empty status="error" />;
