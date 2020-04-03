import { useContext, useEffect, useReducer } from 'react';
import { camelizeKeys } from 'humps';
import template from 'lodash/template';
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
        data: action.payload,
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

function useApi(path) {
  const context = useContext(WorkbenchContext);
  const [state, dispatch] = useReducer(reducer, {
    data: {},
    status: 'idle',
    error: null,
  });
  const interpolate = /{([\s\S]+?)}/g;
  const compiled = template(path, {
    interpolate,
  });
  const urlPath = compiled(context);
  const controller = new AbortController();
  const { signal } = controller;

  async function request() {
    dispatch({ type: 'LOADING' });

    try {
      const url = `${context.baseURL}/${urlPath}`;
      const res = await fetch(url, {
        signal,
        method: 'GET',
      });

      if (res.ok) {
        const json = await res.json();
        const payload = camelizeKeys(json, {
          // Avoid - in keys, they for now are matches for app names
          process(key, convert, options) {
            return /-/g.test(key) ? key : convert(key, options);
          },
        });
        dispatch({ type: 'SUCCESS', payload });
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

  function refresh() {
    if (state.status === 'loading') {
      controller.abort();
    }
    request();
  }

  useEffect(() => {
    request();
  }, []);

  return { ...state, refresh };
}

export default useApi;
