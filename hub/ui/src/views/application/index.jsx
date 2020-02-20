import React, { useContext, useEffect, useState } from 'react';
import AppCard from '@src/components/app-card';
import useServer from '@src/hooks/use-server';
import WorkbenchContext from '../../utils/context';

function ApplicationView({ data = {}, onLaunch }) {
  const { user } = useContext(WorkbenchContext);
  const [status, startServer] = useServer({
    app: data.name,
  });
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let socket = null;

    if (data.progressUrl) {
      socket = new EventSource(
        `/hub/api/users/${user}/servers/${data.name}/progress`,
      );
      socket.onmessage(event => {
        const message = JSON.parse(event.data);

        setProgress(message.progress);
        setMessage(message.html_message);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [data, setProgress, setMessage]);

  return (
    <AppCard
      data={data}
      error={status.error}
      ready={progress === 100 || data.ready}
      message={message}
      progress={progress}
      onStartApp={startServer}
      onLaunch={onLaunch}
    />
  );
}

export default ApplicationView;
