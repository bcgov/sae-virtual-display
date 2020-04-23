import React from 'react';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import CsvIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/48';
import Lozenge from '@atlaskit/lozenge';
import PageHeader from '@atlaskit/page-header';

import BreadcrumbLink from './breadcrumb-link';
import {
  Container,
  Content,
  Divider,
  Hgroup,
  ResourcesList,
  TagsContainer,
} from './styles';

function Dataset({ data = {}, location, onSelectPackage, params}) {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        component={BreadcrumbLink}
        text="Metadata"
        href="/metadata"
      />
      <BreadcrumbsItem
        component={BreadcrumbLink}
        text={data.sector}
        href={`${location.pathname}?sector=${data.sector}`}
      />
    </BreadcrumbsStateless>
  );

  return (
      <Container>
        <ak-grid type="fluid">
          {data.id && (
            <div className="row">
              <PageHeader
                breadcrumbs={breadcrumbs}
                bottomBar={
                  <Hgroup>
                    <div>
                      <p>
                        <strong>Published by</strong>{' '}
                        {data.organization.fullTitle} <br />
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
                {data.title}
              </PageHeader>
              <Content>
                <section>
                  <p>{data.notes}</p>
                </section>
                <Divider />
                <section>
                  <h4>{`Resources (${data.resources.length})`}</h4>
                  <ResourcesList>
                    {data.resources &&
                      data.resources.map(d => (
                        <figure key={d.id} onClick={() => onSelectPackage(d)}>
                          <CsvIcon />
                          <p>{`${d.name}.${d.format}`}</p>
                        </figure>
                      ))}
                  </ResourcesList>
                </section>
                <Divider />
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
      </Container>
  );
}

export default Dataset;
