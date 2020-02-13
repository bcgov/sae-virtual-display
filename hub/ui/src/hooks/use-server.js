import { useContext, useState } from 'react';
import WorkbenchContext from '@src/utils/context';

function useServer({ app }) {
  const { DEV, user } = useContext(WorkbenchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  async function fetchData() {
    const controller = new AbortController();
    let isCancelling = false;
    const { signal } = controller;

    setLoading(true);

    try {
      const baseURL = DEV ? 'http://localhost:3000' : '';
      const url = `${baseURL}/users/${user}/servers/${app}`;
      const res = await fetch(url, { signal, method: 'POST' });

      setLoading(false);

      if (!isCancelling) {
        if (res.ok) {
          setSuccess(true);
        } else {
          setError(`${res.status} - ${res.statusText}`);
        }
      }
    } catch (err) {
      if (!isCancelling) {
        setLoading(false);
        setError(err.message);
      }
    }
  }

  return [{ loading, error, success }, fetchData];
}

export default useServer;
