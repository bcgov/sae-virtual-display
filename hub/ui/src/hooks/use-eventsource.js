import { useContext, useEffect, useState } from 'react';
import WorkbenchContext from '@src/utils/context';
import { camelizeKeys } from 'humps';

function useEventSource(server) {
  const { user } = useContext(WorkbenchContext);
  const [state, setState] = useState({
    progress: 0,
    htmlMessage: '',
  });

  useEffect(() => {
    const socket = new EventSource(
      `/hub/api/users/${user}/servers/${server}/progress`,
    );
    socket.onmessage = event => {
      const message = JSON.parse(event.data);

      setState(camelizeKeys(message));
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return { state, setState };
}

export default useEventSource;
