import { useContext, useEffect, useMemo, useReducer } from 'react';
import head from 'lodash/head';
import WorkbenchContext from '@src/utils/context';

export function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        status: 'loading',
      };

    case 'SUCCESS':
      return {
        ...state,
        status: 'success',
      };

    case 'FAILED':
      return {
        ...state,
        error: action.payload,
        status: 'error',
      };

    default:
      throw new Error();
  }
}

function useServer(app) {
  const { baseURL, projects, user } = useContext(WorkbenchContext);
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    error: null,
  });
  const url = `${baseURL}/users/${user}/servers/${app}`;
  const project = head(projects);
  const body = useMemo(
    () => ({
      image: app,
      project,
    }),
    [app, project],
  );

  function makeRequest() {
    dispatch({ type: 'LOADING' });
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function request() {
      try {
        const res = await fetch(url, {
          signal,
          method: 'POST',
          body: JSON.stringify(body),
        });

        if (res.ok) {
          dispatch({ type: 'SUCCESS' });
        } else {
          dispatch({
            type: 'FAILED',
            payload: `${res.status} - ${res.statusText}`,
          });
        }
      } catch (err) {
        dispatch({ type: 'FAILED', payload: err.message });
      }
    }

    if (state.status === 'loading') {
      request();
    }

    return () => {
      controller.abort();
    };
  }, [body, dispatch, state.status, url]);

  return { ...state, request: makeRequest };
}

export default useServer;
