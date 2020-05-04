import React, { useMemo, useState } from 'react';
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
  const [filter, setFilter] = useState('');
  const [showStarred, toggleShowStarred] = useState(false);
  const { data, status, error } = useMetadata(
    'metadata',
    'group_package_show?id=data-innovation-program',
  );
  const regex = new RegExp(filter, 'i');
  const datasets = useMemo(() => {
    if (data) {
      return data.filter(d => {
        if (showStarred) return starred.includes(d.id);
        if (filter) {
          return d.name.search(regex) >= 0;
        }
        return true;
      });
    }
  }, [data, filter, regex, showStarred, starred]);

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  function onFilter(value) {
    setFilter(value);
  }
  function onToggleStarred() {
    toggleShowStarred(state => !state);
  }

  return (
    <Container>
      <MetadataNav starred={showStarred} onToggleStarred={onToggleStarred} />
      {status === 'loading' && <DatasetsListLoading />}
      {status === 'loaded' && (
        <DatasetsList
          data={datasets}
          error={error}
          onFilter={onFilter}
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
