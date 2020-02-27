import { useContext, useEffect, useReducer, useState } from 'react';
import WorkbenchContext from '@src/utils/context';
import { camelizeKeys } from 'humps';

export function reducer(state, action) {
  switch (action.type) {
    case 'CONNECTED':
      return {
        ...state,
        status: 'connected',
      };

    case 'PROGRESS':
      return {
        ...state,
        ...action.payload,
        status: 'streaming',
      };

    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        status: 'error',
      };

    default:
      throw new Error();
  }
}

function useEventSource(server) {
  const { baseURL, user } = useContext(WorkbenchContext);
  const url = `${baseURL}/users/${user}/servers/${server}/progress`;
  const [canConnect, setCanConnect] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    progress: null,
    error: false,
    message: '',
  });

  function request() {
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

  return {
    data: {
      message: state.message,
      progress: state.progress,
    },
    status: state.status,
    error: state.error,
    request,
  };
}

export default useEventSource;
