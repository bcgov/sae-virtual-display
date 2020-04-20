import React from 'react';
import Loading from '@src/components/core/loading';
import { Route } from 'react-router-dom';
import useDataCatalogue from '@src/hooks/use-data-catalogue';

import Card from './card';
import Dataset from '../dataset';
import { Container, Content, List } from './styles';

function Metadata() {
  const { data, status, error } = useDataCatalogue(
    'package_search?q=data-innovation-program',
  );

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  return (
    <Container>
      <List>
        {status === 'error' && (
          <div className="list-group-item list-group-item-danger">{error}</div>
        )}
        {status === 'loading' && <Loading />}
        {data.results && data.results.map(d => <Card key={d.id} data={d} />)}
      </List>
      <Content>
        <Route path="/metadata/:id">
          <Dataset />
        </Route>
      </Content>
    </Container>
  );
}

export default Metadata;
