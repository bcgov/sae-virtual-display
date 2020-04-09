jest.mock(
  '../../../components/servers-filters',
  () => ({ hideIdle, onFilter, onSearch, onSort, status }) => (
    <>
      <button data-testid="btn-filter" onClick={onFilter}>
        filter
      </button>
      <button data-testid="btn-onSearch" onClick={onFilter}>
        filter
      </button>
      <button data-testid="btn-onSort" onClick={onFilter}>
        filter
      </button>
    </>
  ),
);
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkbenchContext from '../../../utils/context';

import Servers from '../';
import { apps, data } from './data';

const Wrapper = props => (
  <WorkbenchContext.Provider
    value={{
      apps,
      user: 'jjonah',
    }}
  >
    <Servers />
  </WorkbenchContext.Provider>
);

describe('views/servers', () => {
  it('should render empty if conditions are met', () => {
    const value = {
      apps: [],
      user: 'jjonah',
    };
    const { getByTestId } = render(
      <WorkbenchContext.Provider value={value}>
        <Servers />
      </WorkbenchContext.Provider>,
    );

    expect(getByTestId('empty')).toBeInTheDocument();
  });
});
