import { act, renderHook } from '@testing-library/react-hooks';

import { makeWrapper } from './utils';
import useHelp, { reducer } from '../use-help';

const config = {
  appName: 'bbsae',
  help: {
    url: 'http://help-api',
  },
};
const wrapper = makeWrapper(config);

describe('hooks/use-help', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should return default status', () => {
    const { result } = renderHook(() => useHelp('onboarding'), { wrapper });

    expect(result.current).toEqual({
      data: [],
      status: 'idle',
      error: null,
      request: expect.any(Function),
    });
  });

  it('should make a GET request to the correct URL', async () => {
    const { result } = renderHook(() => useHelp('onboarding'), { wrapper });

    fetch.mockResponseOnce();

    await act(() => result.current.request());

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].method).toEqual('GET');
    expect(fetch.mock.calls[0][0]).toEqual(
      'http://help-api/api/v1/article/bbsae/onboarding',
    );
  });

  it('should set the correct status', async () => {
    const { result } = renderHook(() => useHelp('onboarding'), { wrapper });

    fetch.mockResponse(JSON.stringify([{ id: 1 }]));

    await act(() => result.current.request());
    expect(result.current).toEqual({
      data: [{ id: 1 }],
      error: null,
      status: 'success',
      request: result.current.request,
    });
  });

  it('should handle a failed request', async () => {
    const { result } = renderHook(() => useHelp('onboarding'), { wrapper });

    fetch.mockReject(new Error('Failed to load'));

    await act(() => result.current.request());

    expect(result.current).toEqual({
      data: [],
      error: 'Failed to load',
      status: 'error',
      request: result.current.request,
    });
  });
});
