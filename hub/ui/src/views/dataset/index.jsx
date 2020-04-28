import React, { useEffect, useState } from 'react';
import Loading from '@src/components/core/loading';
import { useLocation, useParams } from 'react-router-dom';
import useMetadata from '@src/hooks/use-metadata';
import Dataset from '@src/components/dataset';

import PackageView from '../package';

function DatasetView() {
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

  return (
    <>
      <PackageView
        data={selectedPackage}
        onClose={() => onSelectPackage(null)}
      />
      {status === 'error' && (
        <div className="row text-center text-danger">{error}</div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'loaded' && (
        <Dataset
          data={data}
          location={location}
          onSelectPackage={onSelectPackage}
        />
      )}
    </>
  );
}

export default DatasetView;
