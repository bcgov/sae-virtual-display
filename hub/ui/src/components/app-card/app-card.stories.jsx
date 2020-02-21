import React from 'react';
import { action } from '@storybook/addon-actions';
import { colors } from '@atlaskit/theme';

import AppCard from './';
import AppCardLoading from './loading';
import data from './__tests__/data';

const idleData = { ...data, ready: false };
const clickProps = {
  onLaunch: action('Launch app'),
  onStartApp: action('Call to start server'),
};

export default {
  title: 'App Card',
  component: AppCard,
  decorators: [
    storyFn => (
      <div style={{ padding: 20, backgroundColor: colors.skeleton }}>
        {storyFn()}
      </div>
    ),
  ],
};

export const Idle = () => (
  <AppCard {...clickProps} ready={false} data={idleData} />
);
export const Booting = () => (
  <AppCard
    {...clickProps}
    data={{ ...data, ready: false }}
    progress={55}
    message="Installing dependencies, please wait..."
  />
);
export const Running = () => (
  <>
    <AppCard {...clickProps} ready data={data} />
    <AppCard {...clickProps} ready data={data} progress={100} />
  </>
);
export const Requesting = () => <AppCard loading data={data} />;
export const Loading = () => <AppCardLoading total={5} />;
export const Error = () => <AppCard error data={idleData} />;
export const MissingDetails = () => (
  <AppCard
    {...clickProps}
    data={{
      ...data,
      ready: false,
      container: null,
      description: null,
      logo: null,
      lastActivity: '',
    }}
  />
);
