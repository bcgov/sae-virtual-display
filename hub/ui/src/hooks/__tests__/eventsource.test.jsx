import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { sources } from 'eventsourcemock';

import WorkbenchContext from '../../utils/context';
import useEventSource from '../use-eventsource';

const messageEvent = new MessageEvent('foo', {
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

    expect(result.current.state).toEqual({
      progress: 0,
      htmlMessage: '',
    });
  });

  it('should update progress', () => {
    const { result } = renderHook(() => useEventSource('app'), { wrapper });
    sources[url].emitOpen();
    act(() => {
      sources[url].emitMessage(messageEvent);
    });

    expect(result.current.state.progress).toBe(11);
    expect(result.current.state.htmlMessage).toBe('Starting...');
  });
});
