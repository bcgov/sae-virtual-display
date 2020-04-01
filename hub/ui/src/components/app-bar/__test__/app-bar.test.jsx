jest.mock('../../../views/help', () => ({ open, onClose }) =>
  open ? (
    <div>
      Help Dialog{' '}
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  ) : null,
);
import React from 'react';
import { act, cleanup, fireEvent, render, wait } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import AppBar from '../index';
import Help from '../../../views/help';

const history = createMemoryHistory();
const Wrapper = props => (
  <Router history={history}>
    <AppBar {...props} />
  </Router>
);

describe('app-bar', () => {
  afterEach(cleanup);

  it('should render a default state', () => {
    const { queryByTestId } = render(<Wrapper />);

    expect(queryByTestId('start-tour-btn')).toBeFalsy();
    expect(queryByTestId('username')).toBeFalsy();
  });

  it('should render username', () => {
    const { getByTestId } = render(<Wrapper user="jjonah" />);

    act(() => {
      fireEvent.click(getByTestId('trigger'));
    });

    expect(getByTestId('username')).toHaveTextContent('jjonah');
  });

  it('should only show help if it loads', () => {
    const { getByTestId } = render(<Wrapper isHelpEnabled />);
    expect(getByTestId('start-tour-btn')).toBeInTheDocument();
  });

  it('should toggle help dialog state', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <Wrapper isHelpEnabled />,
    );
    act(() => {
      fireEvent.click(getByTestId('trigger'));
    });
    await wait();
    act(() => {
      fireEvent.click(getByTestId('help-button'));
    });

    expect(getByText('Help Dialog')).toBeInTheDocument();
    act(() => {
      fireEvent.click(getByTestId('close-button'));
    });
    expect(queryByText('Help Dialog')).not.toBeInTheDocument();
  });
});
