import * as React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import data from './data';
import AppCard from '../';
import Loading from '../loading';

describe('app-card', () => {
  afterEach(cleanup);

  describe('app-card/index', () => {
    it('should render', () => {
      const { container } = render(<AppCard data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    // TODO: return to this when domain logic is pulled out of app-card component.
    // it('should render progress bar', async () => {
    //   const { getByText } = render(
    //     <AppCard data={{ ...data, ready: false }} />,
    //   );
    //   fireEvent.click(getByText('Build Application'));
    //   const progressText = await waitForElement(() =>
    //     getByText('Starting R Studio'),
    //   );
    //   expect(progressText).toBeTruthy();
    // });
  });

  describe('app-card/loading', () => {
    it('should render', () => {
      const { container, getAllByTestId } = render(<Loading />);

      expect(container.firstChild).toMatchSnapshot();
      expect(getAllByTestId('app-card-loading').length).toEqual(1);
    });

    it('should render total amount of rows requested', () => {
      const { getAllByTestId } = render(<Loading total={5} />);
      expect(getAllByTestId('app-card-loading').length).toEqual(5);
    });
  });
});
