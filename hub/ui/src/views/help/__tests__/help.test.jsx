import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkbenchContext from '../../../utils/context';

import Help from '../';

const context = {
  help: {
    url: 'http://help-api/api',
    main: 'onboarding',
  },
};
const Wrapper = props => (
  <WorkbenchContext.Provider value={context}>
    <Help {...props} />
  </WorkbenchContext.Provider>
);

describe('views/help', () => {
  it('should be empty on default', () => {
    const { queryByTestId } = render(<Wrapper />);

    expect(queryByTestId('help-dialog')).not.toBeInTheDocument();
  });

  it('should render the dialog on open', () => {
    const { getByTestId } = render(<Wrapper open />);

    expect(getByTestId('help-dialog')).toBeInTheDocument();
  });
});
