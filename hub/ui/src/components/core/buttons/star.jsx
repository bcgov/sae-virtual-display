import React from 'react';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import StarIcon from '@atlaskit/icon/glyph/star';
import { colors } from '@atlaskit/theme';

import { StarredButton } from './styles';

function StarButton({ id, starred, onClick }) {
  function onToggle(event) {
    event.stopPropagation();
    event.preventDefault();
    onClick(id);
    return false;
  }

  return (
    <StarredButton
      appearance="subtle"
      spacing="compact"
      iconBefore={
        starred ? (
          <StarFilledIcon primaryColor={colors.yellow} />
        ) : (
          <StarIcon primaryColor={colors.subtleText} />
        )
      }
      onClick={onToggle}
    />
  );
}

export default StarButton;
