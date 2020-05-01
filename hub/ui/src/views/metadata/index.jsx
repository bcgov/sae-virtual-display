import React, { useState } from 'react';
import DatasetsList from '@src/components/datasets-list';
import DatasetsListLoading from '@src/components/datasets-list/loading';
import { Route, Switch } from 'react-router-dom';
import MetadataNav from '@src/components/metadata-nav';
import useMetadata from '@src/hooks/use-metadata';
import useLocalStorage from '@src/hooks/use-localstorage';

import Dataset from '../dataset';
import MetadataSearch from '../metadata-search';
import { Container, Content, ContentContainer } from './styles';

function Metadata() {
  const [starred] = useLocalStorage('starred', []);
  const [showStarred, toggleShowStarred] = useState(false);
  const { data, status, error } = useMetadata(
    'metadata',
    'group_package_show?id=data-innovation-program',
  );

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  function onToggleStarred() {
    toggleShowStarred(state => !state);
  }

  // function onStarDataset(id) {
  //   save(
  //     starred.includes(id) ? starred.filter(d => d !== id) : [...starred, id],
  //   );
  // }

  return (
    <Container>
      <MetadataNav starred={showStarred} onToggleStarred={onToggleStarred} />
      {status === 'loading' && <DatasetsListLoading />}
      {status === 'loaded' && (
        <DatasetsList
          data={data.filter(d => {
            if (showStarred) return starred.includes(d.id);
            return true;
          })}
          error={error}
          starred={starred}
        />
      )}
      <Content>
        <ContentContainer>
          <Switch>
            <Route path="/metadata/search">
              <MetadataSearch />
            </Route>
            <Route path="/metadata/:id">
              <Dataset />
            </Route>
          </Switch>
        </ContentContainer>
      </Content>
    </Container>
  );
}

export default Metadata;
