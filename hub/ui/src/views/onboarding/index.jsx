import React, { useEffect, useState } from 'react';
import isNil from 'lodash/isNil';
import nth from 'lodash/nth';
import sanitize from 'sanitize-html';
import { Spotlight } from '@atlaskit/onboarding';

function Onboarding({ data = [], enabled }) {
  const [index, setIndex] = useState(null);
  const sections = data.map(d => d.page && d.page.title);
  const section = nth(data, index);
  const target = data.reduce((prev, d) => {
    if (index >= 0) {
      return nth(sections, index);
    }
    return prev;
  }, null);

  useEffect(() => {
    if (enabled) {
      setIndex(0);
    }
  }, [enabled]);

  // There seems to be an ordering issue with the library, so trigger a browser resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [index]);

  const renderActions = () => {
    const actions = [];

    if (index + 1 < data.length) {
      actions.push({ onClick: () => setIndex(s => s + 1), text: 'Next' });
    } else {
      actions.push({ onClick: () => setIndex(null), text: 'Finish' });
    }

    if (index > 0) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    return actions;
  };

  if (!isNil(index) && section) {
    return (
      <Spotlight actions={renderActions()} target={target}>
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
        />
      </Spotlight>
    );
  }

  return null;
}

export default Onboarding;
