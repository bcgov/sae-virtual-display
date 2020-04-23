import React, { useEffect, useState } from 'react';
import Loading from '@src/components/core/loading';
import { useLocation, useParams } from 'react-router-dom';
import useMetadata from '@src/hooks/use-metadata';
import Dataset from '@src/components/dataset';

import PackageView from '../package';

function DatasetView() {
  const [selectedPackage, onSelectPackage] = useState(null);
  const params = useParams();
  const location = useLocation();
  const { data, status, error } = useMetadata(`package_show?id=${params.id}`);

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
