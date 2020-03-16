import React, { useEffect, useState } from 'react';
import sanitize from 'sanitize-html';
import { Spotlight } from '@atlaskit/onboarding';

function Onboarding({ data, enabled }) {
  const [index, setIndex] = useState(0);
  const section = data[index - 1];

  useEffect(() => {
    if (enabled) {
      setIndex(1);
    }
  }, [enabled]);

  // There seems to be an ordering issue with the library, so trigger a browser resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [index]);

  const renderActions = () => {
    const actions = [];

    if (index < data.length) {
      actions.push({ onClick: () => setIndex(s => s + 1), text: 'Next' });
    } else {
      actions.push({ onClick: () => setIndex(0), text: 'Finish' });
    }

    if (index > 1) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    return actions;
  };

  if (index > 0 && section) {
    return (
      <Spotlight
        actions={renderActions()}
        dialogPlacement="right center"
        heading={section.page.title}
        target={`help-${section.page.numbering}`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
        />
      </Spotlight>
    );
  }

  return null;
}

export default Onboarding;
