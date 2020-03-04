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

    case 'DONE':
      return {
        ...state,
        ...action.payload,
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
    ready: false,
    status: 'idle',
    progress: null,
    error: false,
    message: '',
    url: '',
  });

  function request() {
    setCanConnect(true);
  }

  useEffect(() => {
    let socket = null;

    if (canConnect) {
      socket = new EventSource(url);
      socket.onopen = () => dispatch({ type: 'CONNECTED' });
      socket.onerror = () =>
        dispatch({ type: 'ERROR', payload: 'An error occurred' });
      socket.onmessage = event => {
        const payload = camelizeKeys(JSON.parse(event.data));

        if (payload.failed) {
          dispatch({ type: 'ERROR', payload: payload.message });
        } else if (payload.ready) {
          dispatch({ type: 'DONE', payload });
          socket.close();
        } else {
          dispatch({
            type: 'PROGRESS',
            payload,
          });
        }
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
      ready: state.ready,
      progress: state.progress,
      url: state.url,
    },
    status: state.status,
    error: state.error,
    request,
  };
}

export default useEventSource;
