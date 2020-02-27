import { useContext, useReducer, useState } from 'react';
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
  const project = head(projects);

  async function request() {
    const controller = new AbortController();
    let isCancelling = false;
    const { signal } = controller;

    dispatch({ type: 'LOADING' });

    try {
      const url = `${baseURL}/users/${user}/servers/${app}`;
      const res = await fetch(url, {
        signal,
        method: 'POST',
        body: JSON.stringify({
          image: app,
          project,
        }),
      });

      if (!isCancelling) {
        if (res.ok) {
          dispatch({ type: 'SUCCESS' });
        } else {
          dispatch({
            type: 'FAILED',
            payload: `${res.status} - ${res.statusText}`,
          });
        }
      }
    } catch (err) {
      if (!isCancelling) {
        dispatch({ type: 'FAILED', payload: err.message });
      }
    }
  }

  return { ...state, request };
}

export default useServer;
