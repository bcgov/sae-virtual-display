import { useContext, useEffect, useState } from 'react';
import { camelizeKeys } from 'humps';
import WorkbenchContext from '@src/utils/context';

const store = new Map();

function useApi(path) {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, loadData] = useState();
  const { DEV } = useContext(WorkbenchContext);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelling = false;

    async function fetchData() {
      const { signal } = controller;

      setIsLoading(true);

      try {
        const baseURL = DEV ? 'http://localhost:3000' : '/hub/api';
        const url = [baseURL, path].join('/');
        const res = await fetch(url, { signal });

        setIsLoading(false);

        if (!isCancelling) {
          if (res.ok) {
            const result = await res.json();
            const response = camelizeKeys(result);
            store.set(path, response);
            loadData(response);
          } else {
            setError(`${res.status} - ${res.statusText}`);
          }
        }
      } catch (err) {
        if (!isCancelling) {
          setIsLoading(false);
          setError(err.message);
        }
      }
    }

    if (store.has(path)) {
      loadData(store.get(path));
    } else {
      fetchData();
    }

    return () => {
      isCancelling = true;
      controller.abort();
    };
  }, [path]);

  return [result, loading, error];
}

export default useApi;
