import get from 'lodash/get';
import has from 'lodash/has';
import { useCallback, useEffect, useReducer } from 'react';
import { camelizeKeys } from 'humps';

const store = new Map();

const initialState = {
  status: 'idle',
  error: null,
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
        status: 'loaded',
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

function useMetadata(key, query) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const controller = new AbortController();
  const { signal } = controller;

  const lookupKey = Array.isArray(key) ? key.join() : key;

  const request = useCallback(
    async query => {
      dispatch({ type: 'LOADING' });

      try {
        const res = await fetch(
          `https://catalogue.data.gov.bc.ca/api/3/action/${query}`,
          { signal },
        );

        if (res.ok) {
          const { result } = await res.json();
          const response = camelizeKeys(result);
          store.set(lookupKey, response);
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
    },
    [dispatch, signal],
  );

  useEffect(() => {
    if (query) {
      request(query);
    }
  }, []);

  // useEffect(() => {
  //   return () => {
  //     controller.abort();
  //   };
  // }, [controller]);

  return {
    ...state,
    data: store.get(lookupKey),
    request,
  };
}

export default useMetadata;
