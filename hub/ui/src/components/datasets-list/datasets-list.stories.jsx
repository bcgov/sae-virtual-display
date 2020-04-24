import React from 'react';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-react-router';

import DatasetsList from './';
import Card from './card';
import data, { item } from './__tests__/data';

export default {
  title: 'Datasets List',
  component: DatasetsList,
  decorators: [StoryRouter()],
};

const defaultProps = {
  onStarred: action('starred'),
};

export const Default = () => <DatasetsList data={data} />;
export const ListItem = () => <Card {...defaultProps} data={item} />;
export const ListItemStarred = () => (
  <Card {...defaultProps} starred data={item} />
);
