import React from 'react';

export const config = {
  announcement: '',
  baseURL: '/',
  staticURL: '/',
  help: {
    url: '',
    documentation: '',
    onboarding: '',
  },
  user: '',
  apps: [],
  projects: [],
};

const WorkbenchContext = React.createContext(config);

export default WorkbenchContext;
