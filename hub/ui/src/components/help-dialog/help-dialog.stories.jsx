import React from 'react';
import { action } from '@storybook/addon-actions';
import { colors } from '@atlaskit/theme';

import HelpDialog from './index';
import data from './data';

export default {
  title: 'Help Dialog',
  component: HelpDialog,
  decorators: [
    storyFn => (
      <div style={{ padding: 20, backgroundColor: colors.skeleton }}>
        {storyFn()}
      </div>
    ),
  ],
};

export const Loading = () => (
  <HelpDialog status="loading" onClose={action('close')} />
);
export const Failed = () => (
  <HelpDialog status="error" onClose={action('close')} />
);
export const Content = () => (
  <HelpDialog data={data} status="loaded" onClose={action('close')} />
);
