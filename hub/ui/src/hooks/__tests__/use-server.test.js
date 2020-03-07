import { act, renderHook } from '@testing-library/react-hooks';

import { makeWrapper } from './utils';
import useServer, { reducer } from '../use-server';

const config = {
  baseURL: '/hub/api',
  user: 'jjonah',
};
const wrapper = makeWrapper(config);

describe('useServer', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should return default status', () => {
    const { result } = renderHook(() => useServer('app'), { wrapper });

    expect(result.current).toEqual({
      status: 'idle',
      error: null,
      request: expect.any(Function),
      shutdown: expect.any(Function),
    });
  });

  it('formats the request and gets a success status back', async () => {
    const onStart = jest.fn();
    const onShutdown = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useServer('app', {
          onStart,
          onShutdown,
        }),
      {
        wrapper,
      },
    );
    fetch.mockResponseOnce();

    act(() => result.current.request());
    await waitForNextUpdate();

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].method).toEqual('POST');
    expect(fetch.mock.calls[0][0]).toEqual('/hub/api/users/jjonah/servers/app');
    expect(result.current.status).toEqual('success');
    expect(onStart).toHaveBeenCalled();
    expect(onShutdown).not.toHaveBeenCalled();
  });

  // it('sets status to loading', async () => {
  //   const { result } = renderHook(() => useServer('app'), {
  //     wrapper,
  //   });

  //   fetch.mockResponseOnce();
  //   await act(async () => result.current.request());

  //   expect(result.current.status).toEqual('loading');
  // });

  it('should shutdown', async () => {
    const onStart = jest.fn();
    const onShutdown = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useServer('app', {
          onStart,
          onShutdown,
        }),
      {
        wrapper,
      },
    );

    fetch.mockResponseOnce();
    act(() => result.current.shutdown());
    await waitForNextUpdate();

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/hub/api/users/jjonah/servers/app');
    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
    expect(result.current.status).toEqual('success');
    expect(onShutdown).toHaveBeenCalled();
  });

  it('should handle no onShutdown callback', async () => {
    const onStart = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useServer('app', {
          onStart,
        }),
      {
        wrapper,
      },
    );

    fetch.mockResponseOnce();
    act(() => result.current.shutdown());
    await waitForNextUpdate();

    expect(onStart).not.toHaveBeenCalled();
  });

  it('should handle failed attempts', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useServer('app'), {
      wrapper,
    });
    fetch.mockReject(new Error('Server could not be started'));

    act(() => result.current.request());
    await waitForNextUpdate();

    expect(result.current).toEqual(
      expect.objectContaining({
        status: 'error',
        error: 'Server could not be started',
      }),
    );
  });

  it('should return failed status if body is not ok', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useServer('app'), {
      wrapper,
    });

    fetch.mockResponse('', { status: 403 });
    act(() => result.current.request());
    await waitForNextUpdate();

    expect(result.current.status).toEqual('error');
    expect(result.current.error).toEqual('403 - Forbidden');
  });

  it('reducer should throw error if unhandled', () => {
    expect(() => reducer({}, {})).toThrow();
  });
});
