import React from 'react';

export const config = {
  announcement: '',
  formAction: '/spawn',
  staticURL: '/',
  user: '',
  apps: [],
  projects: [],
};

const WorkbenchContext = React.createContext(config);

export default WorkbenchContext;
