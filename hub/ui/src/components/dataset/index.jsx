import React from 'react';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Lozenge from '@atlaskit/lozenge';
import PageHeader from '@atlaskit/page-header';
import StarredView from '@src/views/starred';
import { SpotlightTarget } from '@atlaskit/onboarding';

import BreadcrumbLink from './breadcrumb-link';
import ResourceItem from './resource-item';
import {
  BreadcrumbsContainer,
  Container,
  Content,
  Divider,
  Hgroup,
  InfoList,
  ResourcesList,
  TagsContainer,
} from './styles';

function Dataset({
  data = {},
  location,
  onChangeDataset,
  onSelectSector,
  onSelectPackage,
  params,
}) {
  const onNavClick = dir => () => onChangeDataset(data.id, dir);
  const onSectorClick = event => {
    event.preventDefault();
    onSelectSector(data.sector);
  };
  const breadcrumbs = (
    <BreadcrumbsContainer>
      <BreadcrumbsStateless>
        <BreadcrumbsItem
          component={BreadcrumbLink}
          text="Metadata"
          href="/metadata"
        />
        <BreadcrumbsItem text={data.sector} onClick={onSectorClick} />
      </BreadcrumbsStateless>
      <SpotlightTarget name="metadata-dataset-pagination">
        <ButtonGroup>
          <Button iconBefore={<ChevronLeftIcon />} onClick={onNavClick(-1)} />
          <Button iconBefore={<ChevronRightIcon />} onClick={onNavClick(1)} />
        </ButtonGroup>
      </SpotlightTarget>
    </BreadcrumbsContainer>
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
                    <InfoList>
                      <dt>Publish date</dt>
                      <dd>{data.recordPublishDate}</dd>
                      <dt>Published by</dt>
                      <dd>{data.organization.fullTitle}</dd>
                      <dt>Licensed under</dt>
                      <dd>
                        <Lozenge appearance="new">{data.licenseTitle}</Lozenge>
                      </dd>
                      <dt>Tags</dt>
                      <dd>
                        <TagsContainer>
                          {data.tags.map(t => (
                            <Lozenge appearance="default" key={t.id}>
                              {t.displayName}
                            </Lozenge>
                          ))}
                        </TagsContainer>
                      </dd>
                    </InfoList>
                  </div>
                </Hgroup>
              }
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SpotlightTarget name="metadata-dataset-starred">
                  <StarredView id={data.id} />
                </SpotlightTarget>
                {data.title}
              </div>
            </PageHeader>
            <Content>
              <section>
                <p>{data.notes}</p>
              </section>
              <Divider />
              <SpotlightTarget name="metadata-dataset-resources">
                <section>
                  <h4>{`Resources (${data.resources.length})`}</h4>
                  <ResourcesList>
                    {data.resources &&
                      data.resources.map(d => (
                        <ResourceItem
                          key={d.id}
                          data={d}
                          onClick={onSelectPackage}
                        />
                      ))}
                  </ResourcesList>
                </section>
              </SpotlightTarget>
              <Divider />
              <section>
                <h4>Additional Information</h4>
                <InfoList>
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
                </InfoList>
              </section>
            </Content>
          </div>
        )}
      </ak-grid>
    </Container>
  );
}

export default Dataset;
