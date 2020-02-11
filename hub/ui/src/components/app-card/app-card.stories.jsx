import React from 'react';
import { colors } from '@atlaskit/theme';

import { workbenchContextDecorator } from '../../../test/decorators';
import AppCard from './';
import AppCardLoading from './loading';
import data from './__tests__/data';

export default {
  title: 'App Card',
  component: AppCard,
  decorators: [
    workbenchContextDecorator(),
    storyFn => (
      <div style={{ padding: 20, backgroundColor: colors.skeleton }}>
        {storyFn()}
      </div>
    ),
  ],
};

export const Idle = () => <AppCard data={{ ...data, ready: false }} />;
export const Running = () => <AppCard data={data} />;
export const Booting = () => <AppCard data={data} progress={0.25} />;
export const Loading = () => <AppCardLoading total={5} />;
export const MissingDetails = () => (
  <AppCard data={{ ...data, container: null, description: null, logo: null }} />
);
