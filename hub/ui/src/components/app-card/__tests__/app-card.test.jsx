import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import data from './data';
import AppCard from '../';
import Loading from '../loading';

const cachedLocation = window.location;

describe('app-card', () => {
  afterEach(cleanup);

  describe('app-card/index', () => {
    it('should render', () => {
      const { container } = render(<AppCard data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render labels correctly', () => {
      const { getByText, rerender } = render(<AppCard data={data} />);
      expect(getByText('Idle')).toBeTruthy();

      rerender(<AppCard ready data={data} />);
      expect(getByText('Running')).toBeTruthy();

      rerender(<AppCard error data={data} />);
      expect(getByText('Failed')).toBeTruthy();
    });

    it('should launch a ready app', () => {
      const onLaunch = jest.fn();
      const { getByText } = render(
        <AppCard ready data={data} onLaunch={onLaunch} />,
      );
      fireEvent.click(getByText('Launch'));

      expect(onLaunch).toHaveBeenCalled();
    });

    it('should stop event bubbling on info button', () => {
      const onStart = jest.fn();
      const { getByText } = render(
        <AppCard data={{ ...data, container: '/test' }} onStart={onStart} />,
      );
      fireEvent.click(getByText('View Info'));
      expect(onStart).not.toHaveBeenCalled();
    });

    describe('app-card/in-progress', () => {
      it('should render loading state', () => {
        const { getByText } = render(
          <AppCard loading data={{ ...data, ready: false }} />,
        );
        expect(getByText('Loading...')).toBeTruthy();
      });
      it('should render progress bar', async () => {
        const onStartApp = jest.fn();
        const onClick = jest.fn();
        const { getByText } = render(
          <AppCard
            data={{ ...data, ready: false }}
            onClick={onClick}
            onStartApp={onStartApp}
          />,
        );
        fireEvent.click(getByText('Build Application'));

        expect(onStartApp).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
      });

      it('should render progress view when passed progress value', () => {
        const progressText = 'In Progress';
        const { getByText } = render(
          <AppCard
            data={{ ...data, ready: false }}
            progress={10}
            message={progressText}
          />,
        );
        expect(getByText(progressText)).toBeTruthy();
        expect(getByText('10% complete')).toBeTruthy();
      });
    });
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

  describe('app-card/running', () => {
    const onClick = jest.fn();
    const onShutdown = jest.fn();
    const { getByText } = render(
      <AppCard ready data={data} onClick={onClick} onShutdown={onShutdown} />,
    );
    fireEvent.click(getByText('Shutdown'));

    expect(onShutdown).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
