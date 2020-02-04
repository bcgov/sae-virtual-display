import React from 'react';

import AppCard from './';

const data = {
  name: 'rstudio',
  label: 'R Studio',
  image: '/images/rstudio-logo.png',
  ready: true,
  started: '2020-01-09T19:00:04.000Z',
  lastActivity: '2020-01-09T19:00:04.000Z',
  pending: '',
  version: '1.1',
};

export default {
  title: 'App Card',
  component: AppCard,
  decorators: [storyFn => <div style={{ margin: 20 }}>{storyFn()}</div>],
};

export const Idle = () => <AppCard data={{ ...data, ready: false }} />;
export const Running = () => <AppCard data={data} />;
export const Booting = () => <AppCard booting data={data} progress={25} />;
