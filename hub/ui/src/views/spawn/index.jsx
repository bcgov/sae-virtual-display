import React, { useContext, useEffect, useState } from 'react';
import Announcement from '@src/components/announcement';
import Progress from '@src/components/core/progress';
import SpawnForm from '@src/components/spawn-form';
import { useHistory } from 'react-router-dom';
import WorkbenchContext from '@src/utils/context';

import { Card, Container } from './styles';

function Dashboard() {
  const history = useHistory();
  const { announcement, apps, projects } = useContext(WorkbenchContext);
  const projectOptions = projects.map(p => {
    return { value: p, label: p };
  });
  const [isSpawning, setIsSpawning] = useState(true);

  useEffect(() => {
    document.title = 'Virtual Display Hub | Spawn';
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    setIsSpawning(true);
  }

  function onCancel() {
    history.push('/');
  }

  return (
    <>
      {announcement && <Announcement message={announcement} />}
      <Container>
        {!isSpawning && (
          <Card>
            <Progress message="Spawning Application..." value={50} />
          </Card>
        )}
        {isSpawning && (
          <SpawnForm
            apps={apps}
            projectOptions={projectOptions}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        )}
      </Container>
    </>
  );
}

export default Dashboard;
