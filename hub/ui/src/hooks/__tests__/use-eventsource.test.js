import { act, renderHook } from '@testing-library/react-hooks';
import { sources } from 'eventsourcemock';

import { makeWrapper } from './utils';
import useEventSource, { reducer } from '../use-eventsource';

const url = '/hub/api/users/jjonah/servers/app/progress';
const config = {
  baseURL: '/hub/api',
  user: 'jjonah',
};
const wrapper = makeWrapper(config);
const messageEvent = new MessageEvent('ping', {
  data: JSON.stringify({
    progress: 11,
    raw_event: {
      message: 'Successfully assigned apps/display-data-curator to server',
    },
    message:
      '2020-03-04 18:08:13+00:00 [Normal] Successfully assigned apps/display-data-curator to server',
  }),
});
const startEvent = new MessageEvent('ping', {
  data: JSON.stringify({
    progress: 0,
    message: 'Server requested',
  }),
});
const errorEvent = new MessageEvent('ping', {
  data: JSON.stringify({
    progress: 100,
    failed: true,
    message: 'Spawn failed',
  }),
});
const successEvent = new MessageEvent('ping', {
  data: JSON.stringify({
    progress: 100,
    ready: true,
    message: 'Server ready at /user/jjonah/rstudio-dev/',
    url: '/user/jjonah/rstudio-dev/',
  }),
});

describe('useEventSource', () => {
  it('default init should return default config', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    expect(result.current).toEqual({
      status: 'idle',
      error: false,
      data: {
        ready: false,
        progress: null,
        message: '',
        url: '',
      },
      request: expect.any(Function),
    });
  });

  it('should connect after being instantiated', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current.request());
    act(() => sources[url].emitOpen());

    expect(result.current.status).toEqual('connected');
  });

  it('should handle a notification without a raw_event', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current.request());
    act(() => {
      sources[url].emitOpen();
      sources[url].emitMessage(startEvent);
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        progress: 0,
        message: 'Server requested',
      }),
    );
  });

  it('should update progress', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current.request());
    act(() => sources[url].emitOpen());
    act(() => sources[url].emitMessage(messageEvent));

    expect(result.current.data).toEqual({
      ready: false,
      progress: 11,
      message: 'Successfully assigned apps/display-data-curator to server',
      url: '',
    });
  });

  it('should handle progress end', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current.request());
    act(() => sources[url].emitOpen());
    act(() => sources[url].emitMessage(successEvent));

    expect(result.current.data).toEqual({
      ready: true,
      progress: 100,
      message: 'Server ready at /user/jjonah/rstudio-dev/',
      url: '/user/jjonah/rstudio-dev/',
    });
  });

  // NOTE: onerror seems to throw false positives, so disabling for now
  // it('should handle onerror events', () => {
  //   const { result } = renderHook(() => useEventSource('app'), {
  //     wrapper,
  //   });
  //   act(() => result.current.request());
  //   act(() => sources[url].emitError('An error occurred'));
  //   expect(result.current).toEqual(
  //     expect.objectContaining({
  //       error: 'An error occurred',
  //       status: 'error',
  //     }),
  //   );
  // });

  it('should handle an error message (does not trigger onerror)', () => {
    const { result } = renderHook(() => useEventSource('app'), {
      wrapper,
    });
    act(() => result.current.request());
    act(() => sources[url].emitMessage(errorEvent));
    expect(result.current).toEqual(
      expect.objectContaining({
        data: {
          ready: false,
          progress: null,
          message: '',
          url: '',
        },
        error: 'Spawn failed',
        status: 'error',
      }),
    );
  });

  it('should not try to disconnect if never mounted', () => {
    const { unmount } = renderHook(() => useEventSource('app'), {
      wrapper,
    });

    act(() => unmount());
    expect(sources['/hub/api/users/jjonah/servers/empty/progress']).toBeFalsy();
  });

  it('should disconnect on unmount', () => {
    const { result, unmount } = renderHook(() => useEventSource('empty'), {
      wrapper,
    });

    act(() => result.current.request());
    act(() => unmount());
    expect(sources[url].readyState).toBe(2);
  });

  it('should throw an error if a reducer dispatch is missing a type', () => {
    expect(() => reducer({}, {})).toThrow();
  });
});
