import React from 'react';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-react-router';

import LoadingItem from './loading';
import Search from './';
import SearchEmpty from './empty';
import SearchResult from './result';
import data from './__tests__/data';

export default {
  title: 'Search',
  component: Search,
  decorators: [StoryRouter()],
};

export const Empty = () => (
  <Search data={[]} status="loaded" onSearch={action()} />
);
export const EmptyView = () => <SearchEmpty data="Search Term" />;
export const Loading = () => (
  <Search data={[]} status="loading" onSearch={action()} />
);
export const Results = () => (
  <Search data={data.result.results} status="loaded" onSearch={action()} />
);

export const Result = () => (
  <div style={{ margin: '5%' }}>
    <SearchResult data={data.result.results[0]} />
  </div>
);

export const ItemLoading = () => (
  <div style={{ margin: '5%' }}>
    <LoadingItem />
  </div>
);
