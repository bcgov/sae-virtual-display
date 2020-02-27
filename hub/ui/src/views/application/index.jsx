import React, { useEffect } from 'react';
import AppCard from '@src/components/app-card';
import useServer from '@src/hooks/use-server';
import useEventSource from '@src/hooks/use-eventsource';

function ApplicationView({ data = {}, onLaunch }) {
  const { request, ...es } = useEventSource(data.name);
  const server = useServer(data.name);

  useEffect(() => {
    if (server.status === 'success') {
      request();
    }
  }, [request, server]);

  return (
    <AppCard
      data={data}
      error={server.status === 'error' || es.status === 'error'}
      ready={es.data.progress === 100 || data.ready}
      message={es.data.message}
      progress={es.data.progress}
      onStartApp={server.request}
      onLaunch={onLaunch}
    />
  );
}

export default ApplicationView;
