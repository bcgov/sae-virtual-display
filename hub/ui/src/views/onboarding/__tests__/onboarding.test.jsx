import * as React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import {
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import Onboarding from '../';

const data = [
  {
    id: 1,
    page: {
      title: 'home-item-1',
      body: 'This is a button',
    },
  },
  {
    id: 2,
    page: {
      title: 'home-item-2',
      body: 'This is a form',
    },
  },
  {
    id: 3,
    page: {
      title: 'home-item-3',
      body: 'This is a complex thing',
    },
  },
  {
    id: 4,
    page: {
      title: 'metadata-item-1',
      body: 'Metadata explanation 1',
    },
  },
  {
    id: 5,
    page: {
      title: 'metadata-item-2',
      body: 'Metadata explanation 2',
    },
  },
];

function Wrapper({ children, index = 0 }) {
  return (
    <MemoryRouter initialEntries={['/', '/metadata']} initialIndex={index}>
      <SpotlightManager>
        <Switch>
          <Route exact path="/">
            <div>
              <SpotlightTarget name="home-item-1">
                <div>Target 1</div>
              </SpotlightTarget>
              <SpotlightTarget name="home-item-2">
                <div>Target 2</div>
              </SpotlightTarget>
              <SpotlightTarget name="home-item-3">
                <div>Target 3</div>
              </SpotlightTarget>
            </div>
          </Route>
          <Route exact path="/metadata">
            <div>
              <SpotlightTarget name="metadata-item-1">
                <div>Metadata 1</div>
              </SpotlightTarget>
              <SpotlightTarget name="metadata-item-2">
                <div>Metadata 2</div>
              </SpotlightTarget>
            </div>
          </Route>
        </Switch>
        <SpotlightTransition>{children}</SpotlightTransition>
      </SpotlightManager>
    </MemoryRouter>
  );
}

describe('views/onboarding', () => {
  it("should render nothing if there's no data", () => {
    const { queryByTestId } = render(
      <Wrapper>
        <Onboarding />
      </Wrapper>,
    );
    expect(queryByTestId('onboarding--target')).toBeNull();
  });

  it('should not render if enabled but no data', () => {
    const { queryByTestId } = render(
      <Wrapper>
        <Onboarding enabled data={[]} />
      </Wrapper>,
    );
    expect(queryByTestId('onboarding--dialog')).toBeNull();
  });

  it('should render content after being enabled', () => {
    const { getByTestId, getByText, queryByText } = render(
      <Wrapper>
        <Onboarding enabled data={data} />
      </Wrapper>,
    );
    const dialog = getByTestId('onboarding--dialog');
    const finishButton = queryByText('Finish');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('This is a button');
    expect(getByText('Next')).toBeTruthy();
    expect(dialog).not.toContainElement(finishButton);
  });

  it('should move through the whole tour', () => {
    const onComplete = jest.fn();
    global.dispatchEvent = jest.fn();
    const { getByTestId, getByText } = render(
      <Wrapper>
        <Onboarding enabled data={data} onComplete={onComplete} />
      </Wrapper>,
    );
    const dialog = getByTestId('onboarding--dialog');
    const nextButton = getByText('Next');

    fireEvent.click(nextButton);
    expect(dialog).toHaveTextContent('This is a form');
    expect(getByText('Prev')).toBeInTheDocument();
    fireEvent.click(nextButton);
    expect(global.dispatchEvent).toHaveBeenCalled();

    const finishButton = getByText('Finish');
    expect(finishButton).toBeInTheDocument();
    fireEvent.click(finishButton);
    expect(onComplete).toHaveBeenCalled();
  });

  it('should move back if requested', () => {
    const { getByText, queryByText } = render(
      <Wrapper>
        <Onboarding enabled data={data} />
      </Wrapper>,
    );
    const nextButton = getByText('Next');
    fireEvent.click(nextButton);
    const prevButton = getByText('Prev');
    fireEvent.click(prevButton);
    expect(queryByText('Prev')).not.toBeInTheDocument();
  });

  it('should render metdata only on the metadata page', () => {
    const { getByText } = render(
      <Wrapper index={1}>
        <Onboarding enabled data={data} />
      </Wrapper>,
    );
    expect(getByText('Metadata explanation 1')).toBeInTheDocument();
  });
});
