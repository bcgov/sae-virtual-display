import React from 'react';
import PageHeader from '@atlaskit/page-header';

import Card from './card';
import CoreImage from '../core/image';
import Loading from '../core/loading';
import { Intro, CardsList } from './styles';
import useDataCatalogue from '../../hooks/useDataCatalogue';

function Metadata() {
  const [data, loading, error] = useDataCatalogue(
    'group_show?id=data-innovation-program&include_datasets=true'
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
              <aside>
                <CoreImage fluid src={data.imageDisplayUrl} width={150} />
              </aside>
              <p>{data.description}</p>
            </Intro>
          }
        >
          {data.title}
        </PageHeader>
        <CardsList>
          {error && (
            <div className="list-group-item list-group-item-danger">
              {error}
            </div>
          )}
          {loading && <Loading />}
          {data.packages &&
            data.packages.map(d => <Card key={d.id} data={d} />)}
        </CardsList>
      </ak-grid-column>
    </ak-grid>
  );
}

export default Metadata;
