import React from 'react';

export const config = {
  staticURL: '/',
  user: {},
  apps: [],
};

const WorkbenchContext = React.createContext(config);

export default WorkbenchContext;
