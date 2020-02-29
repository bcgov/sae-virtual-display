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
    });
  });

  it('formats the request and gets a success status back', async () => {
    const { result } = renderHook(() => useServer('app'), {
      wrapper,
    });
    fetch.mockResponseOnce();

    await act(() => result.current.request());

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/hub/api/users/jjonah/servers/app');
    expect(result.current.status).toEqual('success');
  });

  // it('sets status to loading', async () => {
  //   const { result } = renderHook(() => useServer('app'), {
  //     wrapper,
  //   });
  //   fetch.mockResponseOnce(
  //     () =>
  //       new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 1000)),
  //   );

  //   await act(() => result.current.request());
  //   expect(result.current.status).toEqual('loading');
  // });

  it('should handle failed attempts', async () => {
    const { result } = renderHook(() => useServer('app'), {
      wrapper,
    });
    fetch.mockReject(new Error('Server could not be started'));

    await act(() => result.current.request());

    expect(result.current).toEqual(
      expect.objectContaining({
        status: 'error',
        error: 'Server could not be started',
      }),
    );
  });

  it('shgould return failed status if body is not ok', async () => {
    const { result } = renderHook(() => useServer('app'), {
      wrapper,
    });
    fetch.mockResponse('', { status: 403 });
    await act(() => result.current.request());
    expect(result.current.status).toEqual('error');
    expect(result.current.error).toEqual('403 - Forbidden');
  });

  it('should not make a request after being cancelled', () => {
    const { unmount } = renderHook(() => useServer('app'), {
      wrapper,
    });
    fetch.mockAbort();

    act(() => unmount());
    expect(fetch.mock.calls.length).toEqual(0);
  });

  it('reducer should throw error if unhandled', () => {
    expect(() => reducer({}, {})).toThrow();
  });
});
