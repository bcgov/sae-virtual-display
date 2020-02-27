import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { sources } from 'eventsourcemock';

import WorkbenchContext from '../../utils/context';
import useEventSource, { reducer } from '../use-eventsource';

const messageEvent = new MessageEvent('ping', {
  data: JSON.stringify({
    progress: 11,
    html_message: 'Starting...',
  }),
});

const config = {
  baseURL: '/hub/api',
  user: 'jjonah',
};
const url = '/hub/api/users/jjonah/servers/app/progress';
const wrapper = ({ children }) => (
  <WorkbenchContext.Provider value={config}>
    {children}
  </WorkbenchContext.Provider>
);

describe('useEventSource', () => {
  it('default init should return default config', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    expect(result.current).toEqual({
      status: 'idle',
      error: false,
      data: {
        progress: null,
        message: '',
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

  it('should update progress', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current.request());
    act(() => sources[url].emitOpen());
    act(() => sources[url].emitMessage(messageEvent));

    expect(result.current.data).toEqual({
      progress: 11,
      message: 'Starting...',
    });
  });

  it('should handle onerror events', () => {
    const { result } = renderHook(() => useEventSource('app'), {
      wrapper,
    });
    act(() => result.current.request());
    act(() => sources[url].emitError('Something broke'));
    expect(result.current).toEqual(
      expect.objectContaining({
        error: 'Something broke',
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
