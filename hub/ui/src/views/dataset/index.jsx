import React, { useEffect, useState } from 'react';
import Dataset from '@src/components/dataset';
import DatasetLoading from '@src/components/dataset/loading';
import last from 'lodash/last';
import head from 'lodash/head';
import { useLocation, useParams } from 'react-router-dom';
import useMetadata from '@src/hooks/use-metadata';
import useLocalStorage from '@src/hooks/use-localstorage';

import PackageView from '../package';

function DatasetView({ onChangeDataset, onSelectSector }) {
  const [starred, save] = useLocalStorage('starred', []);
  const [selectedPackage, onSelectPackage] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  const { data, request, status, error } = useMetadata(
    ['metadata', id],
    `package_show?id=${id}`,
  );

  useEffect(() => {
    request(`package_show?id=${id}`);
  }, [id]);

  useEffect(() => {
    if (data) {
      document.title = `Workbench | Metadata | ${data.title}`;
    }
  }, [data]);

  function onChangePackage(dir) {
    const currentIndex = data.resources.indexOf(selectedPackage);
    const nextIndex = currentIndex + dir;

    if (nextIndex < 0) {
      onSelectPackage(last(data.resources));
    } else if (nextIndex === data.resources.length) {
      onSelectPackage(head(data.resources));
    } else {
      onSelectPackage(data.resources[nextIndex]);
    }
  }

  function onStarDataset(id) {
    save(
      starred.includes(id) ? starred.filter(d => d !== id) : [...starred, id],
    );
  }

  return (
    <>
      <PackageView
        data={selectedPackage}
        onClose={() => onSelectPackage(null)}
        onChange={onChangePackage}
      />
      {status === 'error' && (
        <div className="row text-center text-danger">{error}</div>
      )}
      {status === 'loading' && <DatasetLoading />}
      {status === 'loaded' && (
        <Dataset
          data={data}
          location={location}
          onChangeDataset={onChangeDataset}
          onSelectSector={onSelectSector}
          onSelectPackage={onSelectPackage}
          onStarred={onStarDataset}
        />
      )}
    </>
  );
}

export default DatasetView;
