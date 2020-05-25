import React, { useEffect, useReducer } from 'react';
import { csvParse } from 'd3-dsv';
import isEmpty from 'lodash/isEmpty';
import PackageDialog from '@src/components/package-dialog';

function reducer(state, action) {
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
        data: action.payload,
      };

    case 'FAILED':
      return {
        ...state,
        error: action.payload,
        status: 'error',
      };

    default:
      throw new Error('No state');
  }
}

function PackageView({ data = {}, onClose, onChange }) {
  const [state, dispatch] = useReducer(reducer, {
    error: null,
    data: [],
    status: 'idle',
  });

  useEffect(() => {
    async function requestCsv() {
      dispatch({ type: 'LOADING' });
      try {
        const res = await fetch(data.url);
        const text = await res.text();
        dispatch({ type: 'SUCCESS', payload: csvParse(text) });
      } catch (err) {
        dispatch({ type: 'FAILED', payload: err });
      }
    }

    if (data) {
      requestCsv();
    }
  }, [data]);

  return (
    <PackageDialog
      {...state}
      name={data && data.name}
      open={!isEmpty(data)}
      onChange={onChange}
      onClose={onClose}
    />
  );
}

export default PackageView;
