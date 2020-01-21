import React, { useState } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import Select from '@atlaskit/select';

import CoreImage from '../core/image';
import { AppOption, Card, CheckedIcon, Footer, Header } from './styles';

function SpawnForm({ apps, projectOptions, onCancel, onSubmit }) {
  const [project, setProject] = useState('');
  const [app, setApp] = useState('');

  return (
    <Card>
      <Header>
        <h3>Which application would you like to use?</h3>
      </Header>
      <form onSubmit={onSubmit}>
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
              isDisabled={!project || !app}
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
