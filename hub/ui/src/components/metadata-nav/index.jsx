import React from 'react';
import Button from '@atlaskit/button';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import SearchIcon from '@atlaskit/icon/glyph/search';
import StarIcon from '@atlaskit/icon/glyph/star-large';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import { SpotlightTarget } from '@atlaskit/onboarding';

import NavButton from '../nav-button';
import { Container, NavBarButton } from './styles';

function MetadataNav({
  onToggleFilters,
  onToggleStarred,
  showFilters,
  showStarred,
}) {
  const starredTooltipText = showStarred ? 'Show All Datasets' : 'Show Starred';
  const starredColor = showStarred ? colors.yellow : colors.N0;

  return (
    <Container>
      <li>
        <Tooltip content="Search" position="right">
          <NavButton
            appearance="subtle"
            iconBefore={<SearchIcon primaryColor="#fff" />}
            href="/metadata/search"
          />
        </Tooltip>
      </li>
      <li>
        <SpotlightTarget name="metadata-filters">
          <Tooltip content="Toggle Filters" position="right">
            <NavBarButton
              appearance="subtle"
              isSelected={showFilters}
              iconBefore={<FilterIcon primaryColor="#fff" />}
              onClick={onToggleFilters}
            />
          </Tooltip>
        </SpotlightTarget>
      </li>
      <li>
        <SpotlightTarget name="metadata-starred">
          <Tooltip content={starredTooltipText} position="right">
            <NavBarButton
              appearance="subtle"
              isSelected={showStarred}
              iconBefore={<StarIcon primaryColor={starredColor} />}
              onClick={onToggleStarred}
            />
          </Tooltip>
        </SpotlightTarget>
      </li>
    </Container>
  );
}

export default MetadataNav;
