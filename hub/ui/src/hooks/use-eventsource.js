import { useContext, useEffect, useState } from 'react';
import WorkbenchContext from '@src/utils/context';
import { camelizeKeys } from 'humps';

function useEventSource(server) {
  const { user } = useContext(WorkbenchContext);
  const [error, setError] = useState(false);
  const [status, setState] = useState({
    progress: 0,
    htmlMessage: '',
  });

  useEffect(() => {
    const socket = new EventSource(
      `/hub/api/users/${user}/servers/${server}/progress`,
    );
    socket.onerror = error => setError(true);
    socket.onmessage = event => {
      const message = JSON.parse(event.data);

      setState(camelizeKeys(message));
    };

    return () => socket.close();
  }, []);

  return [status, error];
}

export default useEventSource;
