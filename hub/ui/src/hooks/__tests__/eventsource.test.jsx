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

    expect(result.current[0]).toEqual({
      connected: false,
      error: false,
      progress: null,
      message: '',
    });
  });

  it('should connect after being instantiated', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current[1]());
    act(() => sources[url].emitOpen());

    expect(result.current[0].connected).toBeTruthy();
  });

  it('should update progress', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });

    act(() => result.current[1]());
    act(() => sources[url].emitOpen());
    act(() => sources[url].emitMessage(messageEvent));

    expect(result.current[0]).toEqual({
      connected: true,
      error: false,
      progress: 11,
      message: 'Starting...',
    });
  });

  it('should handle onerror events', () => {
    const { result } = renderHook(() => useEventSource('app'), {
      wrapper,
    });
    act(() => result.current[1]());
    act(() => sources[url].emitError('Something broke'));
    expect(result.current[0].error).toBeTruthy();
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

    act(() => result.current[1]());
    act(() => unmount());
    expect(sources[url].readyState).toBe(2);
  });

  it('should throw an error if a reducer dispatch is missing a type', () => {
    expect(() => reducer({}, {})).toThrow();
  });
});
