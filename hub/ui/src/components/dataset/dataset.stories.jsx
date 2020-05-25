import React from 'react';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-react-router';

import Dataset from './';
import DatasetLoading from './loading';
import data from './__tests__/data';

const location = {
  location: {
    pathname: '/test',
  },
};
export default {
  title: 'Dataset',
  component: Dataset,
  decorators: [
    StoryRouter(),
    storyFn => <div style={{ padding: 20 }}>{storyFn()}</div>,
  ],
};

export const Loaded = () => (
  <Dataset starred={false} data={data} location={location} />
);

export const Loading = () => <DatasetLoading />;
