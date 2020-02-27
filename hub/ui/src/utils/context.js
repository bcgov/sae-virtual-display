import React from 'react';

export const config = {
  announcement: '',
  baseURL: '/',
  staticURL: '/',
  user: '',
  apps: [],
  projects: [],
};

const WorkbenchContext = React.createContext(config);

export default WorkbenchContext;
