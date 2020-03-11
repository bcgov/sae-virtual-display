import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import CoreImage from '../';

describe('core/image', () => {
  afterEach(cleanup);

  it('should render', () => {
    const { container } = render(<CoreImage />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle fluid prop', () => {
    const { container } = render(<CoreImage fluid />);
    expect(container.firstChild).toHaveStyleRule('max-width', '100%');
  });

  it('should always have an alt tag', () => {
    const altText = 'Alternative Text';
    const noAlt = render(<CoreImage />);
    const alt = render(<CoreImage alt={altText} />);

    expect(noAlt.container.firstChild).toHaveAttribute('alt');
    expect(alt.container.firstChild).toHaveAttribute('alt');
  });
});
