import React from 'react';
import WorkbenchContext from '../src/utils/context';

export const defaultContext = {
  announcement: '',
  staticURL: '/',
  imagesDir: 'images',
  formAction: '/spawn',
  user: 'jjones',
  apps: [],
  projects: [],
  DEV: true,
};

export const workbenchContextDecorator = (
  context = defaultContext,
) => storyFn => (
  <WorkbenchContext.Provider value={context}>
    {storyFn()}
  </WorkbenchContext.Provider>
);
