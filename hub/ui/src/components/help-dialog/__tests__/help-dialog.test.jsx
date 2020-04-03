import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import HelpDialog from '../';
import data from '../data';

describe('help-dialog', () => {
  afterEach(cleanup);

  it('should render with no props assigned', () => {
    const { getByTestId } = render(<HelpDialog />);
    expect(getByTestId('help-dialog')).toBeInTheDocument();
  });

  it('should render loading', () => {
    const { getByTestId } = render(<HelpDialog status="loading" />);
    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it('should render a failed request', () => {
    const { getByTestId } = render(<HelpDialog status="error" />);
    expect(getByTestId('error-message')).toBeInTheDocument();
  });

  it('should render content', () => {
    const { getByTestId } = render(<HelpDialog data={data} status="loaded" />);
    const node = getByTestId('help-content');

    expect(node).toHaveTextContent('This is some body content');
  });

  it('should call onClose', () => {
    const onClose = jest.fn();
    const { getByText } = render(<HelpDialog onClose={onClose} />);

    fireEvent.click(getByText('Done'));
    expect(onClose).toHaveBeenCalled();
  });
});
