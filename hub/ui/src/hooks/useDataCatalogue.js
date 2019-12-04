import React, { useEffect, useState } from 'react';
import { camelizeKeys } from 'humps';

const store = new Map();

function useDataCatalogue(query) {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, loadData] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    let isCancelling = false;

    async function fetchData() {
      const { signal } = controller;

      setIsLoading(true);

      try {
        const res = await fetch(
          `https://catalogue.data.gov.bc.ca/api/3/action/${query}`,
          { signal }
        );

        setIsLoading(false);

        if (!isCancelling) {
          if (res.ok) {
            const { result } = await res.json();
            const response = camelizeKeys(result);
            store.set(query, response);
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

    if (store.has(query)) {
      loadData(store.get(query));
    } else {
      fetchData();
    }

    return () => {
      isCancelling = true;
      controller.abort();
    };
  }, []);

  return [result, loading, error];
}

export default useDataCatalogue;
