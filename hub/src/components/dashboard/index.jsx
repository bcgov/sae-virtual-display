import React, { useContext, useEffect, useState } from 'react';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';

import CoreImage from '../core/image';
import WorkbenchContext from '../../utils/context';
import {
  Announcement,
  AppOption,
  Card,
  CheckedIcon,
  Container,
  Footer,
  Header,
} from './styles';

function Dashboard() {
  const [project, setProject] = useState('');
  const [app, setApp] = useState('');
  const { announcement, apps } = useContext(WorkbenchContext);

  useEffect(() => {
    document.title = 'Workbench | Dashboard';
  }, []);

  return (
    <>
      {announcement && (
        <Announcement>
          <SectionMessage appearance="warning">{announcement}</SectionMessage>
        </Announcement>
      )}
      <Container>
        <Card>
          <Header>
            <h3>Which application would you like to use?</h3>
          </Header>
          <form onSubmit={e => e.preventDefault()}>
            <div className="ak-field-group">
              <label>Select a Project</label>
              <Select
                value={project}
                onChange={setProject}
                placeholder="Select your Project"
                options={[
                  {
                    value: '/project1',
                    label: '/project1',
                  },
                  {
                    value: '/project2',
                    label: '/project2',
                  },
                ]}
              />
            </div>
            <div className="ak-field-group">
              <label>Select an Application</label>
              <ak-grid class="app-grid">
                {apps.map(d => (
                  <ak-grid-column size="6" key={d.name}>
                    <AppOption
                      onClick={_ => setApp(d.name)}
                      selected={d.name === app}
                    >
                      {d.name === app && (
                        <CheckedIcon>
                          <CheckCircleIcon />
                        </CheckedIcon>
                      )}
                      <CoreImage
                        fluid
                        src={d.image}
                        className="app-icon"
                        alt={`${d.label} logo`}
                        title={d.label}
                      />
                      <p>{d.label}</p>
                    </AppOption>
                  </ak-grid-column>
                ))}
              </ak-grid>
            </div>
            <Footer>
              <Button
                appearance="primary"
                id="Workbench-spawn-btn"
                className="btn btn-primary pull-right"
                isDisabled={!project || !app}
              >
                Start Application
              </Button>
            </Footer>
          </form>
        </Card>
      </Container>
    </>
  );
}

export default Dashboard;
