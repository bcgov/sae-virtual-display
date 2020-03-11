import React from 'react';
import WorkbenchContext from '../../utils/context';

export const makeWrapper = config => ({ children }) => (
  <WorkbenchContext.Provider value={config}>
    {children}
  </WorkbenchContext.Provider>
);
