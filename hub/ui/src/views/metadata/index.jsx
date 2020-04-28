import React from 'react';
import DatasetsList from '@src/components/datasets-list';
import { Route, Switch } from 'react-router-dom';
import MetadataNav from '@src/components/metadata-nav';
import useMetadata from '@src/hooks/use-metadata';

import Dataset from '../dataset';
import MetadataSearch from '../metadata-search';
import { Container, Content } from './styles';

function Metadata() {
  const { data, status, error } = useMetadata(
    'group_package_show?id=data-innovation-program',
  );

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  return (
    <Container>
      <MetadataNav />
      {status === 'loaded' && (
        <DatasetsList data={data} status={status} error={error} />
      )}
      <Content>
        <Switch>
          <Route path="/metadata/search">
            <MetadataSearch />
          </Route>
          <Route path="/metadata/:id">
            <Dataset />
          </Route>
        </Switch>
      </Content>
    </Container>
  );
}

export default Metadata;
