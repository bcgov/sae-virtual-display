import { useContext, useEffect, useMemo, useReducer } from 'react';
import head from 'lodash/head';
import merge from 'lodash/merge';
import WorkbenchContext from '@src/utils/context';

const defaultEvents = {
  onStart: () => null,
  onShutdown: () => null,
};

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

function useServer(app, events = {}) {
  const options = merge({}, defaultEvents, events);
  const { baseURL, projects, user } = useContext(WorkbenchContext);
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    error: null,
  });
  const url = `${baseURL}/users/${user}/servers/${app}`;
  const project = head(projects);
  const controller = new AbortController();
  const { signal } = controller;
  const body = useMemo(
    () => ({
      image: app,
      project,
    }),
    [app, project],
  );

  async function request(method) {
    dispatch({ type: 'LOADING' });
    try {
      const res = await fetch(url, {
        signal,
        method,
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

  async function makeRequest() {
    await request('POST');
    options.onStart();
  }

  async function shutdown() {
    await request('DELETE');
    options.onShutdown();
  }

  return { ...state, request: makeRequest, shutdown };
}

export default useServer;
