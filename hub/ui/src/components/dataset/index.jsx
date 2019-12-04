import React, { useEffect } from 'react';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import Lozenge from '@atlaskit/lozenge';
import PageHeader from '@atlaskit/page-header';

import Loading from '../core/loading';
import BreadcrumbLink from './breadcrumb-link';
import { Content, Hgroup, TagsContainer } from './styles';
import useDataCatalogue from '../../hooks/useDataCatalogue';

function Dataset() {
  const params = useParams();
  const [data, loading, error] = useDataCatalogue(
    `package_show?id=${params.id}`
  );
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        component={BreadcrumbLink}
        text="Metadata"
        href="/metadata"
      />
      <BreadcrumbsItem
        text={data.groups && data.groups[0] && data.groups[0].title}
      />
    </BreadcrumbsStateless>
  );

  useEffect(() => {
    if (data.title) {
      document.title = `Workbench | Metadata | ${data.title}`;
    }
  }, [data]);

  return (
    <ak-grid type="fluid">
      {error && <div className="row text-center text-danger">{error}</div>}
      {loading && <Loading />}
      {data.id && (
        <div className="row">
          <PageHeader
            breadcrumbs={breadcrumbs}
            bottomBar={
              <Hgroup>
                <div>
                  <p>
                    <strong>Published by</strong> {data.organization.fullTitle}{' '}
                    <br />
                    <strong>Licensed under</strong>{' '}
                    <Lozenge appearance="new">{data.licenseTitle}</Lozenge>
                  </p>
                </div>
                <TagsContainer>
                  {data.tags.map(t => (
                    <Lozenge appearance="default" key={t.id}>
                      {t.displayName}
                    </Lozenge>
                  ))}
                </TagsContainer>
              </Hgroup>
            }
          >
            {`${data.title} (${data.sector})`}
          </PageHeader>
          <Content>
            <section>
              <p>{data.notes}</p>
            </section>
            <section>
              <h4>Resources</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Format</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {data.resources &&
                    data.resources.map(d => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td>{d.dataCollectionStartDate}</td>
                        <td>{d.dataCollectionEndDate}</td>
                        <td>{d.format}</td>
                        <td>{d.size}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
            <section>
              <h4>Additional Information</h4>
              <dl>
                <dt>Purpose</dt>
                <dd>{data.purpose}</dd>
                <dt>More Information</dt>
                <dd>
                  {data.moreInfo.map(d => (
                    <a key={d.link} href={d.link}>
                      {d.link}
                    </a>
                  ))}
                </dd>
              </dl>
            </section>
          </Content>
        </div>
      )}
    </ak-grid>
  );
}

export default Dataset;
