import React, { useMemo, useState } from 'react';
import DatasetsList from '@src/components/datasets-list';
import DatasetsListLoading from '@src/components/datasets-list/loading';
import { Route, Switch } from 'react-router-dom';
import MetadataEmpty from '@src/components/empty/metadata';
import MetadataNav from '@src/components/metadata-nav';
import orderBy from 'lodash/orderBy';
import useMetadata from '@src/hooks/use-metadata';
import useLocalStorage from '@src/hooks/use-localstorage';

import Dataset from '../dataset';
import MetadataSearch from '../metadata-search';
import { Container, Content, ContentContainer } from './styles';

function Metadata() {
  const [starred] = useLocalStorage('starred', { initialValue: [] });
  const [sortSettings, saveSortSettings] = useLocalStorage('filter', {
    initialValue: {
      sortBy: 'name',
      sortDir: 'asc',
    },
  });
  const [filter, setFilter] = useState('');
  const [showStarred, toggleShowStarred] = useState(false);
  const { data, status, error } = useMetadata(
    'metadata',
    'group_package_show?id=data-innovation-program',
  );
  const regex = new RegExp(filter, 'i');
  const datasets = useMemo(() => {
    if (data) {
      const filteredData = data.filter(d => {
        if (showStarred) return starred.includes(d.id);
        if (filter) {
          return d.name.search(regex) >= 0;
        }
        return true;
      });

      return orderBy(
        filteredData,
        [sortSettings.sortBy],
        [sortSettings.sortDir],
      );
    }
  }, [data, filter, regex, showStarred, starred, sortSettings]);

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
          onSort={saveSortSettings}
          sortBy={sortSettings}
          starred={starred}
        />
      )}
      <Content>
        <ContentContainer>
          <Switch>
            <Route exact path="/metadata">
              <MetadataEmpty />
            </Route>
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
