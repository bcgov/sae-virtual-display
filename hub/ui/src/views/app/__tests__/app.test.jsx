jest.mock('../../onboarding');
jest.mock('../../../hooks/use-help');
jest.mock('../../servers', () => () => 'Servers');
jest.mock('../../onboarding', () => ({ enabled, onComplete }) =>
  enabled ? (
    <div>
      Onboarding Enabled <button onClick={onComplete}>Finish</button>
    </div>
  ) : (
    'Onboarding'
  ),
);

import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import App from '../';
import useHelp from '../../../hooks/use-help';
import WorkbenchContext from '../../../utils/context';

const context = {
  help: {
    url: 'http://help-api/api',
    onboarding: 'onboarding',
  },
  user: 'jjonah',
};
const Wrapper = () => (
  <WorkbenchContext.Provider value={context}>
    <App />
  </WorkbenchContext.Provider>
);

describe('views/app', () => {
  afterEach(cleanup);
  it('should render with default actions', () => {
    const request = jest.fn();
    useHelp.mockReturnValue({
      request,
      data: [],
      status: 'idle',
    });
    const { queryByTestId } = render(<Wrapper />);

    expect(useHelp).toHaveBeenCalledWith('onboarding');
    expect(request).toHaveBeenCalled();
    expect(queryByTestId('start-tour-btn')).toBeNull();
  });

  it('should turn on the onboarding', () => {
    const request = jest.fn();
    useHelp.mockReturnValue({
      request,
      data: [{ id: 1 }],
      status: 'success',
    });
    const { getByTestId, getByText, queryByText } = render(<Wrapper />);
    const startTourBtn = getByTestId('start-tour-btn');

    expect(startTourBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(startTourBtn);
    });
    expect(getByText('Onboarding Enabled')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByText('Finish'));
    });
    expect(queryByText('Onboarding Enabled')).toBeNull();
  });

  it('should render announcement', () => {
    const announcement = 'Announcement Text';
    const { queryByText } = render(
      <WorkbenchContext.Provider value={{ ...context, announcement }}>
        <App />
      </WorkbenchContext.Provider>,
    );

    expect(queryByText(announcement)).toBeInTheDocument();
  });
});
