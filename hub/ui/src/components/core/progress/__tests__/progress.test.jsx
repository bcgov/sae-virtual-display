import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import Progress from '../';

describe('core/progress', () => {
  const headerText = 'In Progress';
  const successText = 'DONE';
  afterEach(cleanup);

  it('should render, with defaults', () => {
    const { container } = render(<Progress />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a message', () => {
    const message = 'This is loading';
    const { getByText } = render(<Progress message={message} />);
    expect(getByText(message)).toBeTruthy();
  });

  it('should render the progress bar correctly', () => {
    const { getByRole } = render(<Progress value={40} />);

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0.4');
  });

  it('should toggle header text', () => {
    const textProps = {
      headerText,
      successText,
    };
    const { getByText, rerender } = render(
      <Progress {...textProps} value={40} />,
    );

    expect(getByText(headerText)).toHaveTextContent(headerText);
    rerender(<Progress {...textProps} value={100} />);
    expect(getByText(successText)).toHaveTextContent(successText);
  });

  it('should handle complete states', () => {
    const { getByRole } = render(<Progress value={100} />);

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });

  it('should not render values below 0', () => {
    const { getByRole } = render(<Progress value={-5} />);
    // expect(getByRole('progressbar')).toHaveStyle('width: 0%');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
