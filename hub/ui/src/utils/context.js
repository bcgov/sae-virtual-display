import React from 'react';

export const config = {
  announcement: '',
  staticURL: '/',
  user: '',
  apps: [],
  projects: [],
};

const WorkbenchContext = React.createContext(config);

export default WorkbenchContext;
