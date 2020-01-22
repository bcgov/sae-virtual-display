import React from 'react';

import ServersList from './';

const apps = [
  {
    name: 'notebook',
    label: 'Jupyter Notebook',
    image: '/images/notebook-logo.png',
  },
  {
    name: 'rstudio',
    label: 'R Studio',
    image: '/images/rstudio-logo.png',
  },
  {
    name: 'browser',
    label: 'Chrome Browser',
    image: '/images/browser-logo.png',
  },
];
const data = [
  {
    name: 'rstudio',
    ready: true,
    pending: '',
    url: '/user/jjones/rstudio/',
    progressUrl: 'http://localhost/',
    started: '2020-01-09T19:00:04.000Z',
    lastActivity: '2020-01-09T19:00:04.000Z',
    state: {},
  },
];

export default {
  title: 'Servers List',
  component: ServersList,
};

export const All = () => <ServersList apps={apps} data={data} />;
export const Empty = () => <ServersList data={[]} />;
export const Loading = () => <ServersList loading />;
