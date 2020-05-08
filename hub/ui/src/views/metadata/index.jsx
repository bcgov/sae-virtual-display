import React, { useCallback, useMemo, useState } from 'react';
import DatasetsList from '@src/components/datasets-list';
import DatasetsListLoading from '@src/components/datasets-list/loading';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import MetadataEmpty from '@src/components/empty/metadata';
import MetadataNav from '@src/components/metadata-nav';
import orderBy from 'lodash/orderBy';
import useMetadata from '@src/hooks/use-metadata';
import useLocalStorage from '@src/hooks/use-localstorage';

import Dataset from '../dataset';
import MetadataSearch from '../metadata-search';
import { Container, Content, ContentContainer } from './styles';

function Metadata() {
  const history = useHistory();
  const [starred] = useLocalStorage('starred', { initialValue: [] });
  const [sortSettings, saveSortSettings] = useLocalStorage('filter', {
    initialValue: {
      sortBy: 'name',
      sortDir: 'asc',
    },
  });
  const [sector, setSector] = useState();
  const [filter, setFilter] = useState('');
  const [showStarred, toggleShowStarred] = useState(false);
  const [showFilters, toggleShowFilters] = useState(false);
  const { data, status, error } = useMetadata(
    'metadata',
    'group_package_show?id=data-innovation-program',
  );
  const regex = new RegExp(filter, 'i');
  const datasets = useMemo(() => {
    if (data) {
      const filteredData = data.filter(d => {
        if (sector) return d.sector === sector;
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
  }, [data, filter, regex, sector, showStarred, starred, sortSettings]);
  const onChangeDataset = useCallback(
    (id, dir) => {
      const ids = datasets.map(d => d.id);
      const index = ids.indexOf(id);
      let nextIndex = index + dir;

      if (nextIndex < 0) {
        nextIndex = ids.length - 1;
      } else if (nextIndex === datasets.length) {
        nextIndex = 0;
      }

      const nextId = ids[nextIndex];
      history.push(`/metadata/${nextId}`);
    },
    [datasets, history],
  );

  React.useEffect(() => {
    document.title = 'Workbench | Metadata';
  }, []);

  function onFilter(value) {
    setFilter(value);
  }

  function onToggleFilters() {
    toggleShowFilters(state => !state);
  }

  function onToggleStarred() {
    toggleShowStarred(state => !state);
  }

  function onSelectSector(sector) {
    setSector(sector);
  }

  return (
    <Container>
      <MetadataNav
        onToggleFilters={onToggleFilters}
        onToggleStarred={onToggleStarred}
        showFilters={showFilters}
        showStarred={showStarred}
      />
      {status === 'loading' && <DatasetsListLoading />}
      {status === 'loaded' && (
        <DatasetsList
          data={datasets}
          error={error}
          onClearSector={onSelectSector}
          onFilter={onFilter}
          onSort={saveSortSettings}
          sector={sector}
          sortBy={sortSettings}
          showFilters={showFilters}
          starred={starred}
        />
      )}
      <Content>
        <ContentContainer>
          <Switch>
            <Route exact path="/metadata">
              {datasets && datasets.length > 0 && (
                <Redirect to={`/metadata/${datasets[0].id}`} />
              )}
              <MetadataEmpty />
            </Route>
            <Route path="/metadata/search">
              <MetadataSearch />
            </Route>
            <Route path="/metadata/:id">
              <Dataset
                onChangeDataset={onChangeDataset}
                onSelectSector={onSelectSector}
              />
            </Route>
          </Switch>
        </ContentContainer>
      </Content>
    </Container>
  );
}

export default Metadata;
