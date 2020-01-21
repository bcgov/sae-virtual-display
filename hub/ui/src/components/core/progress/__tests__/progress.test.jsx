import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import Progress from '../';

describe('core/progress', () => {
  afterEach(cleanup);

  it('should render, with defaults', () => {
    const { container, getByRole, getByText } = render(<Progress />);
    expect(getByRole('progressbar')).toHaveStyle('width: 0%');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a message', () => {
    const message = 'This is loading';
    const { getByText } = render(<Progress message={message} />);
    expect(getByText(message)).toBeTruthy();
  });

  it('should render the progress bar correctly', () => {
    const { getByRole } = render(<Progress value={40} />);
    expect(getByRole('progressbar')).toHaveStyle('width: 40%');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0.4');
  });

  it('should not render values below 0', () => {
    const { getByRole } = render(<Progress value={-5} />);
    expect(getByRole('progressbar')).toHaveStyle('width: 0%');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
