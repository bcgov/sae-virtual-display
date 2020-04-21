import * as React from 'react';
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
      title: 'item-1',
      body: 'This is a button',
    },
  },
  {
    id: 2,
    page: {
      title: 'item-2',
      body: 'This is a form',
    },
  },
  {
    id: 3,
    page: {
      title: 'item-3',
      body: 'This is a complex thing',
    },
  },
];

function Wrapper({ children }) {
  return (
    <SpotlightManager>
      <div>
        <SpotlightTarget name="item-1">
          <div>Target 1</div>
        </SpotlightTarget>
        <SpotlightTarget name="item-2">
          <div>Target 2</div>
        </SpotlightTarget>
        <SpotlightTarget name="item-3">
          <div>Target 3</div>
        </SpotlightTarget>
      </div>
      <SpotlightTransition>{children}</SpotlightTransition>
    </SpotlightManager>
  );
}

describe('views/onboarding', () => {
  afterEach(cleanup);

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

  it('should move through the whole tour', async () => {
    const onComplete = jest.fn();
    global.dispatchEvent = jest.fn();
    const { getByTestId, getByText } = render(
      <Wrapper>
        <Onboarding enabled data={data} onComplete={onComplete} />
      </Wrapper>,
    );
    const dialog = getByTestId('onboarding--dialog');
    const nextButton = getByText('Next');

    act(() => {
      fireEvent.click(nextButton);
    });
    expect(dialog).toHaveTextContent('This is a form');
    expect(getByText('Prev')).toBeInTheDocument();
    act(() => {
      fireEvent.click(nextButton);
    });
    expect(global.dispatchEvent).toHaveBeenCalled();

    const finishButton = getByText('Finish');
    expect(finishButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(finishButton);
    });
    expect(onComplete).toHaveBeenCalled();
  });

  it('should move back if requested', () => {
    const { getByText, queryByText } = render(
      <Wrapper>
        <Onboarding enabled data={data} />
      </Wrapper>,
    );
    const nextButton = getByText('Next');

    act(() => {
      fireEvent.click(nextButton);
    });

    const prevButton = getByText('Prev');

    act(() => {
      fireEvent.click(prevButton);
    });

    expect(queryByText('Prev')).not.toBeInTheDocument();
  });
});
