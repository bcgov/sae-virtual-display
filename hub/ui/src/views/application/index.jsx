import React, { useEffect } from 'react';
import AppCard from '@src/components/app-card';
import useServer from '@src/hooks/use-server';
import useEventSource from '@src/hooks/use-eventsource';

function ApplicationView({ data = {}, onSpawnComplete }) {
  const { request, ...es } = useEventSource(data.name);
  const server = useServer(data.name);
  const hasStreamError = es.status === 'error';
  const message = hasStreamError ? es.error : es.data.message;
  const ready = es.data.ready || data.ready;
  const error = server.status === 'error' || hasStreamError;
  const url = data.url || es.data.url;

  useEffect(() => {
    if (server.status === 'success') {
      request();
    }
  }, [request, server]);

  useEffect(() => {
    if (es.status === 'success') {
      onSpawnComplete();
    }
  }, [es.status, onSpawnComplete]);

  return (
    <AppCard
      data={data}
      error={error}
      ready={ready}
      message={message}
      progress={es.data.progress}
      onStartApp={server.request}
      onLaunch={() => ready && url && window.open(url)}
    />
  );
}

export default ApplicationView;
