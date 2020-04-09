jest.mock('../reducer', () => ({
  defaultState: {
    hideIdle: false,
    search: '',
    sort: 'name',
  },
  reducer: jest.fn().mockReturnValue({
    hideIdle: false,
    search: '',
    sort: 'name',
  }),
}));
jest.mock(
  '../../../components/servers-filters',
  () => ({ hideIdle, onFilter, onSearch, onSort, status }) => (
    <>
      {hideIdle && <div data-testid="hideIdle">hideIdle</div>}
      <div>{status}</div>
      <button data-testid="btn-filter" onClick={onFilter}>
        Filter
      </button>
      <button data-testid="btn-onSearch" onClick={() => onSearch('term')}>
        Search
      </button>
      <button data-testid="btn-onSort" onClick={() => onSort('ready')}>
        Sort
      </button>
    </>
  ),
);
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkbenchContext from '../../../utils/context';

import Servers from '../';
import state from '../reducer';
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

  it('should trigger filter action', () => {
    const dispatch = jest.fn().mockReturnValue(state.defaultState);
    state.reducer.mockImplementationOnce(dispatch);
    const { getByTestId } = render(<Wrapper />);

    act(() => {
      fireEvent.click(getByTestId('btn-filter'));
    });

    expect(dispatch).toBeCalledWith(state.defaultState, { type: 'toggle' });
  });

  it('should trigger search', () => {
    const dispatch = jest.fn().mockReturnValue(state.defaultState);
    state.reducer.mockImplementationOnce(dispatch);
    const { getByTestId } = render(<Wrapper />);
    act(() => {
      fireEvent.click(getByTestId('btn-onSearch'));
    });

    expect(dispatch).toHaveBeenLastCalledWith(
      {
        hideIdle: false,
        search: '',
        sort: 'name',
      },
      { type: 'search', payload: 'term' },
    );
  });

  it('should trigger search', () => {
    const dispatch = jest.fn().mockReturnValue(state.defaultState);
    state.reducer.mockImplementationOnce(dispatch);
    const { getByTestId } = render(<Wrapper />);
    act(() => {
      fireEvent.click(getByTestId('btn-onSort'));
    });

    expect(dispatch).toHaveBeenLastCalledWith(
      {
        hideIdle: false,
        search: '',
        sort: 'name',
      },
      { type: 'sort', payload: 'ready' },
    );
  });
});
