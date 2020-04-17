import get from 'lodash/get';
import { useEffect, useReducer } from 'react';
import { camelizeKeys } from 'humps';

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

function useDataCatalogue(query) {
  const [state, dispatch] = useReducer(reducer, {
    data: {},
    status: 'idle',
    error: null,
  });
  const controller = new AbortController();
  const { signal } = controller;

  async function fetchData() {
    dispatch({ type: 'LOADING' });

    try {
      const res = await fetch(
        `https://catalogue.data.gov.bc.ca/api/3/action/${query}`,
        { signal },
      );

      if (res.ok) {
        const { result } = await res.json();
        const response = camelizeKeys(result);
        dispatch({ type: 'SUCCESS', payload: { [query]: response } });
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

  useEffect(() => {
    if (!state.data[query]) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, []);

  return {
    ...state,
    data: get(state, ['data', query], {}),
  };
}

export default useDataCatalogue;
