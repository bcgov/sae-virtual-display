import React, { useEffect } from 'react';
import AppCard from '@src/components/app-card';
import { SpotlightTarget } from '@atlaskit/onboarding';
import useServer from '@src/hooks/use-server';
import useEventSource from '@src/hooks/use-eventsource';

function ApplicationView({
  data = {},
  hasHelp,
  onShutdownComplete,
  onSpawnComplete,
}) {
  const { request, ...es } = useEventSource(data.name);
  const server = useServer(data.name, {
    onStart: request,
    onShutdown: onShutdownComplete,
  });
  const hasStreamError = es.status === 'error';
  const message = hasStreamError ? es.error : es.data.message;
  const ready = es.data.ready || data.ready;
  const error = server.status === 'error' || hasStreamError;
  const url = data.url || es.data.url;

  useEffect(() => {
    if (es.status === 'success') {
      onSpawnComplete();
    }
  }, [es.status, onSpawnComplete]);

  const element = (
    <AppCard
      data={data}
      error={error}
      ready={ready}
      message={message}
      progress={es.data.progress}
      onStartApp={server.request}
      onShutdown={server.shutdown}
      onLaunch={() => ready && url && window.open(url)}
    />
  );

  if (hasHelp) {
    return <SpotlightTarget name="app-card">{element}</SpotlightTarget>;
  }

  return element;
}

export default ApplicationView;
