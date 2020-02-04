import React, { useState } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import Select from '@atlaskit/select';

import CoreImage from '../core/image';
import { AppOption, Card, CheckedIcon, Footer, Header } from './styles';

function SpawnForm({ apps, projectOptions, onCancel, onSubmit }) {
  const versions = [
    { value: '1.2 (latest)', label: '1.2' },
    { value: '1.1', label: '1.1' },
    { value: '1.0', label: '1.0' },
  ];
  const [project, setProject] = useState(projectOptions[0]);
  const [version, setVersion] = useState(versions[0]);
  const [app, setApp] = useState('');

  return (
    <Card>
      <Header>
        <h3>Configure your Application</h3>
      </Header>
      <form onSubmit={onSubmit}>
        <ak-grid>
          <ak-grid-column size="4">
            <AppOption>
              <CoreImage
                fluid
                src="/images/rstudio-logo.png"
                className="app-icon"
                alt="R Studio logo"
                title="R Studio"
              />
              <p>R Studio</p>
            </AppOption>
          </ak-grid-column>
          <ak-grid-column size="8">
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
            <div className="ak-field-group">
              <label>Select an App Version</label>
              <Select
                name="version"
                value={version}
                onChange={setVersion}
                placeholder="Select a Version"
                options={versions}
              />
            </div>
          </ak-grid-column>
        </ak-grid>
        <div className="ak-field-group" style={{ display: 'none' }}>
          <label>Select an Application</label>
          <ak-grid class="app-grid">
            <input type="hidden" name="image" value={app} />
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
          <ButtonGroup>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="submit"
              appearance="primary"
              id="Workbench-spawn-btn"
              className="btn btn-primary pull-right"
            >
              Start Application
            </Button>
          </ButtonGroup>
        </Footer>
      </form>
    </Card>
  );
}

export default SpawnForm;
