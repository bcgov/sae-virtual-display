import React from 'react';
import Loading from '@src/components/core/loading';
import PageHeader from '@atlaskit/page-header';
import useDataCatalogue from '@src/hooks/use-data-catalogue';

import Card from './card';
import { Intro, CardsList } from './styles';

function Metadata() {
  const { data, status, error } = useDataCatalogue(
    'package_search?q=data-innovation-program',
  );

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  return (
    <ak-grid>
      <ak-grid-column size="12">
        <PageHeader
          bottomBar={
            <Intro>
              <p>This is a list of metadata</p>
            </Intro>
          }
        >
          Metadata
        </PageHeader>
        <CardsList>
          {status === 'error' && (
            <div className="list-group-item list-group-item-danger">
              {error}
            </div>
          )}
          {status === 'loading' && <Loading />}
          {data.results && data.results.map(d => <Card key={d.id} data={d} />)}
        </CardsList>
      </ak-grid-column>
    </ak-grid>
  );
}

export default Metadata;
