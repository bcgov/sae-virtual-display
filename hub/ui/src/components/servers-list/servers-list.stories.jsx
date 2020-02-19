import React from 'react';
import { camelizeKeys } from 'humps';
import db from '../../../db.json';
import get from 'lodash/get';

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
const data = camelizeKeys(get(db, 'users[0].servers', []));

export default {
  title: 'Servers List',
  component: ServersList,
};

export const All = () => <ServersList apps={apps} data={data} />;
export const Empty = () => <ServersList data={[]} />;
export const Loading = () => <ServersList loading />;
