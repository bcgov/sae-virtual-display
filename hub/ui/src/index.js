import React from 'react';
import { render } from 'react-dom';

import App from './components/app';
import WorkbenchContext from './utils/context';

function run(config) {
  render(
    <WorkbenchContext.Provider value={config}>
      <App />
    </WorkbenchContext.Provider>,
    document.getElementById('main'),
  );
}

export default run;
