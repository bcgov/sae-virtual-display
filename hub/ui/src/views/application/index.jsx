import React, { useEffect } from 'react';
import AppCard from '@src/components/app-card';
import useServer from '@src/hooks/use-server';
import useEventSource from '@src/hooks/use-eventsource';

function ApplicationView({ data = {}, onLaunch }) {
  const { request, ...es } = useEventSource(data.name);
  const [status, startServer] = useServer(data.name);

  useEffect(() => {
    if (status.success) {
      request();
    }
  }, [request, status.success]);

  return (
    <AppCard
      data={data}
      error={status.error || es.status === 'error'}
      ready={es.data.progress === 100 || data.ready}
      message={es.data.message}
      progress={es.data.progress}
      onStartApp={startServer}
      onLaunch={onLaunch}
    />
  );
}

export default ApplicationView;
