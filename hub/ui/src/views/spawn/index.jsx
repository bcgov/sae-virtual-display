import React, { useContext, useEffect, useState } from 'react';
import Announcement from '@src/components/announcement';
import Progress from '@src/components/core/progress';
import SpawnForm from '@src/components/spawn-form';
import { useHistory } from 'react-router-dom';
import WorkbenchContext from '@src/utils/context';

import { Container } from './styles';

function Dashboard() {
  const history = useHistory();
  const { announcement, apps, projects } = useContext(WorkbenchContext);
  const projectOptions = projects.map(p => {
    return { value: p, label: p };
  });
  const [isSpawning, setIsSpawning] = useState(false);

  useEffect(() => {
    document.title = 'SAE Virtual Display | Spawn';
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
        {isSpawning && (
          <Progress message="Spawning Application..." value={50} />
        )}
        {!isSpawning && (
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
