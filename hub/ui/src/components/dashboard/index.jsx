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
  const { announcement, apps, projects, formAction } = useContext(WorkbenchContext);

  useEffect(() => {
    document.title = 'Workbench | Dashboard';
  }, []);

  var projectOptions = projects.map(p => { return { value: p, label: p}; });

  projectSelection = (
    <div className="ak-field-group">
        <label>Select a Project</label>
        <Select
        name="project"
        value={project}
        onChange={setProject}
        placeholder="Select your Project"
        options={projectOptions}
        />
    </div>
  )
  if (projects.length == 1) {
    projectSelection = (
        <div className="ak-field-group">
            <label>Project</label>
            <div>{project}</div>
        </div>
    )
  }
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
          <form action={formAction} method="POST">
            {projectSelection}
            <div className="ak-field-group">
              <label>Select an Application</label>
              <ak-grid class="app-grid">
                <input type="hidden" name="image" value={app}/>
                {apps.map(d => (
                  <ak-grid-column size="4" key={d.name}>
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
                type="submit"
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
