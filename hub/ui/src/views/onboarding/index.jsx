import React, { useEffect, useState } from 'react';
import isNil from 'lodash/isNil';
import nth from 'lodash/nth';
import sanitize from 'sanitize-html';
import { Spotlight } from '@atlaskit/onboarding';

function Onboarding({ data = [], enabled, onComplete }) {
  const [index, setIndex] = useState(null);
  const sections = data.map(d => d.page && d.page.title);
  const section = nth(data, index);
  const target = nth(sections, index);

  function handleComplete() {
    setIndex(null);
    onComplete();
  }

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
      actions.push({ onClick: handleComplete, text: 'Finish' });
    }

    if (index > 0) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    return actions;
  };

  if (!isNil(index) && section) {
    return (
      <Spotlight actions={renderActions()} target={target} testId="onboarding">
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
        />
      </Spotlight>
    );
  }

  return null;
}

export default Onboarding;