import { useContext, useEffect, useReducer, useState } from 'react';
import WorkbenchContext from '@src/utils/context';
import { camelizeKeys } from 'humps';

export function reducer(state, action) {
  switch (action.type) {
    case 'CONNECTED':
      return {
        ...state,
        connected: true,
      };

    case 'PROGRESS':
      return {
        ...state,
        ...action.payload,
      };

    case 'ERROR':
      return {
        ...state,
        error: true,
        message: action.payload,
      };

    default:
      throw new Error();
  }
}

function useEventSource(server) {
  const { user } = useContext(WorkbenchContext);
  const url = `/hub/api/users/${user}/servers/${server}/progress`;
  const [canConnect, setCanConnect] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    connected: false,
    progress: null,
    error: false,
    message: '',
  });

  function init() {
    setCanConnect(true);
  }

  useEffect(() => {
    let socket = null;

    if (canConnect) {
      socket = new EventSource(url);
      socket.onopen = () => dispatch({ type: 'CONNECTED' });
      socket.onerror = error => dispatch({ type: 'ERROR', payload: error });
      socket.onmessage = event => {
        const { htmlMessage, progress } = camelizeKeys(JSON.parse(event.data));

        dispatch({
          type: 'PROGRESS',
          payload: { progress, message: htmlMessage },
        });
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [url, canConnect]);

  return [state, init];
}

export default useEventSource;
