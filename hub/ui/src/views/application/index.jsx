import React from 'react';
import AppCard from '@src/components/app-card';
import useServer from '@src/hooks/use-server';
import useEventSource from '@src/hooks/use-eventsource';

function ApplicationView({ data = {}, onLaunch }) {
  const [esStatus, error] = useEventSource(data.name);
  const [status, startServer] = useServer(data.name);

  return (
    <AppCard
      data={data}
      error={status.error || error}
      ready={esStatus.progress === 100 || data.ready}
      message={esStatus.message}
      progress={esStatus.progress}
      onStartApp={startServer}
      onLaunch={onLaunch}
    />
  );
}

export default ApplicationView;
